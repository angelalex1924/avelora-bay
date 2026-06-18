import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/app/lib/firebase/admin';
import type { OrderStatus } from './order-types';

export type ShopifyWebhookOrder = {
  id: number;
  name: string;
  email?: string | null;
  note?: string | null;
  order_status_url?: string | null;
  financial_status?: string | null;
  fulfillment_status?: string | null;
  subtotal_price?: string | null;
  total_price?: string | null;
  created_at?: string | null;
  customer?: {
    email?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  line_items?: Array<{
    title?: string | null;
    quantity?: number | null;
    price?: string | null;
    variant_id?: number | null;
    product_id?: number | null;
  }> | null;
};

function mapShopifyStatus(financialStatus?: string | null, fulfillmentStatus?: string | null): OrderStatus {
  if (fulfillmentStatus === 'fulfilled') return 'delivered';
  if (fulfillmentStatus === 'partial') return 'shipped';
  if (financialStatus === 'paid' || financialStatus === 'partially_paid') return 'processing';
  return 'pending';
}

function extractOrderReference(note?: string | null) {
  if (!note) return null;
  const match = note.match(/AVB-[A-Z0-9]+/i);
  return match?.[0]?.toUpperCase() ?? null;
}

function mapLineItems(items: ShopifyWebhookOrder['line_items']) {
  return (items ?? []).map((item, index) => ({
    id: String(item.variant_id ?? item.product_id ?? index),
    name: item.title ?? 'Item',
    price: `€${Number.parseFloat(item.price ?? '0').toFixed(2)}`,
    image: '/globe.svg',
    qty: item.quantity ?? 1,
    variantId: item.variant_id ? String(item.variant_id) : undefined,
  }));
}

export async function syncShopifyWebhookOrder(order: ShopifyWebhookOrder) {
  const email = order.email ?? order.customer?.email;
  if (!email) return { synced: false, reason: 'missing_email' as const };

  let uid: string;
  try {
    uid = (await getAdminAuth().getUserByEmail(email)).uid;
  } catch {
    return { synced: false, reason: 'user_not_found' as const };
  }

  const db = getAdminDb();
  const ordersRef = db.collection('users').doc(uid).collection('orders');
  const orderReference = extractOrderReference(order.note);
  const shopifyOrderId = String(order.id);
  const subtotal = Number.parseFloat(order.subtotal_price ?? order.total_price ?? '0') || 0;
  const status = mapShopifyStatus(order.financial_status, order.fulfillment_status);
  const shopifyPayload = {
    shopifyOrderId,
    shopifyOrderName: order.name,
    orderNumber: order.name.replace('#', ''),
    statusPageUrl: order.order_status_url ?? null,
    financialStatus: order.financial_status ?? null,
    fulfillmentStatus: order.fulfillment_status ?? null,
    status,
    subtotal,
    syncedAt: FieldValue.serverTimestamp(),
  };

  if (orderReference) {
    const matchSnap = await ordersRef.where('orderNumber', '==', orderReference).limit(1).get();
    if (!matchSnap.empty) {
      const existing = matchSnap.docs[0].data();
      await matchSnap.docs[0].ref.set(
        {
          ...shopifyPayload,
          items: existing.items?.length ? existing.items : mapLineItems(order.line_items),
        },
        { merge: true },
      );
      return { synced: true, orderId: matchSnap.docs[0].id, reason: 'matched_reference' as const };
    }
  }

  const existingSnap = await ordersRef.where('shopifyOrderId', '==', shopifyOrderId).limit(1).get();
  if (!existingSnap.empty) {
    const existing = existingSnap.docs[0].data();
    await existingSnap.docs[0].ref.set(
      {
        ...shopifyPayload,
        items: existing.items?.length ? existing.items : mapLineItems(order.line_items),
      },
      { merge: true },
    );
    return { synced: true, orderId: existingSnap.docs[0].id, reason: 'matched_shopify_id' as const };
  }

  const pendingSnap = await ordersRef.orderBy('createdAt', 'desc').limit(8).get();
  const pendingDoc = pendingSnap.docs.find((entry) => {
    const data = entry.data();
    return data.status === 'pending' && !data.shopifyOrderId;
  });

  if (pendingDoc) {
    const existing = pendingDoc.data();
    await pendingDoc.ref.set(
      {
        ...shopifyPayload,
        items: existing.items?.length ? existing.items : mapLineItems(order.line_items),
      },
      { merge: true },
    );
    return { synced: true, orderId: pendingDoc.id, reason: 'matched_pending' as const };
  }

  const newDoc = ordersRef.doc();
  await newDoc.set({
    createdAt: FieldValue.serverTimestamp(),
    checkoutUrl: order.order_status_url ?? null,
    items: mapLineItems(order.line_items),
    ...shopifyPayload,
  });

  return { synced: true, orderId: newDoc.id, reason: 'created' as const };
}
