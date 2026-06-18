type FirebaseLookupResponse = {
  users?: Array<{ localId: string; email?: string }>;
  error?: { message: string };
};

export async function verifyFirebaseIdTokenWithApiKey(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('Firebase API key is not configured');
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    },
  );

  const payload = (await response.json()) as FirebaseLookupResponse;
  if (!response.ok || !payload.users?.[0]?.localId) {
    throw new Error(payload.error?.message ?? 'Invalid Firebase ID token');
  }

  return {
    uid: payload.users[0].localId,
    email: payload.users[0].email ?? null,
  };
}

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, unknown>;
};

export async function readUserOrderWithIdToken(userId: string, orderId: string, idToken: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('Firebase project ID is not configured');
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}/orders/${orderId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${idToken}` },
    cache: 'no-store',
  });

  if (response.status === 404) return null;
  if (response.status === 403 || response.status === 401) {
    throw new Error('Forbidden');
  }
  if (!response.ok) {
    throw new Error(`Firestore read failed (${response.status})`);
  }

  const doc = (await response.json()) as FirestoreDocument;
  return parseFirestoreOrder(doc);
}

function readStringField(fields: Record<string, unknown>, key: string) {
  const value = fields[key] as { stringValue?: string } | undefined;
  return value?.stringValue ?? undefined;
}

function readNumberField(fields: Record<string, unknown>, key: string) {
  const value = fields[key] as { doubleValue?: number; integerValue?: string } | undefined;
  if (value?.doubleValue != null) return value.doubleValue;
  if (value?.integerValue != null) return Number.parseFloat(value.integerValue);
  return undefined;
}

function readMapFields(value: unknown): Record<string, unknown> | undefined {
  return (value as { mapValue?: { fields?: Record<string, unknown> } })?.mapValue?.fields;
}

function parseOrderItems(fields: Record<string, unknown>) {
  const arrayValue = fields.items as
    | { arrayValue?: { values?: Array<{ mapValue?: { fields?: Record<string, unknown> } }> } }
    | undefined;

  return (arrayValue?.arrayValue?.values ?? []).map((entry, index) => {
    const itemFields = entry.mapValue?.fields ?? {};
    return {
      id: readStringField(itemFields, 'id') ?? String(index),
      name: readStringField(itemFields, 'name') ?? 'Item',
      price: readStringField(itemFields, 'price') ?? '€0.00',
      image: readStringField(itemFields, 'image') ?? '/globe.svg',
      qty: readNumberField(itemFields, 'qty') ?? 1,
      variantId: readStringField(itemFields, 'variantId'),
    };
  });
}

function parseFirestoreOrder(doc: FirestoreDocument) {
  const fields = doc.fields ?? {};
  const createdAt = (fields.createdAt as { timestampValue?: string } | undefined)?.timestampValue ?? null;

  return {
    orderNumber: readStringField(fields, 'orderNumber') ?? '—',
    status: readStringField(fields, 'status') ?? 'pending',
    createdAt,
    items: parseOrderItems(fields),
    subtotal: readNumberField(fields, 'subtotal') ?? 0,
    checkoutUrl: readStringField(fields, 'checkoutUrl'),
    shopifyOrderId: readStringField(fields, 'shopifyOrderId'),
    shopifyOrderName: readStringField(fields, 'shopifyOrderName'),
    statusPageUrl: readStringField(fields, 'statusPageUrl'),
  };
}

export type ParsedFirestoreOrder = ReturnType<typeof parseFirestoreOrder>;
