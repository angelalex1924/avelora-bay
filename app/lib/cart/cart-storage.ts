import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase/client';
import { mergeCartItems } from './merge-items';
import type { CartItem, StoredCartItem } from './cart-types';

const GUEST_STORAGE_KEY = 'avelora-cart-guest';
const LEGACY_GUEST_STORAGE_KEY = 'avelora-cart';

function normalizeItem(raw: StoredCartItem): CartItem | null {
  if (!raw.id || !raw.name || !raw.price || !raw.image) return null;

  return {
    id: String(raw.id),
    name: raw.name,
    price: raw.price,
    image: raw.image,
    category: raw.category,
    qty: raw.qty ?? raw.quantity ?? 1,
    variantId: raw.variantId,
  };
}

function sanitizeForShopify(items: CartItem[]): CartItem[] {
  if (process.env.NEXT_PUBLIC_SHOPIFY_ENABLED !== 'true') return items;
  return items.filter((item) => Boolean(item.variantId));
}

function normalizeItems(raw: StoredCartItem[]): CartItem[] {
  return sanitizeForShopify(raw.map(normalizeItem).filter((item): item is CartItem => item !== null));
}

function cartDocRef(uid: string) {
  return doc(db, 'carts', uid);
}

export function readGuestCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored =
      localStorage.getItem(GUEST_STORAGE_KEY) ?? localStorage.getItem(LEGACY_GUEST_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as StoredCartItem[];
    if (!Array.isArray(parsed)) return [];

    return normalizeItems(parsed);
  } catch {
    return [];
  }
}

export function writeGuestCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items));
  localStorage.removeItem(LEGACY_GUEST_STORAGE_KEY);
  window.dispatchEvent(new Event('avelora-cart-change'));
}

export function clearGuestCart() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(GUEST_STORAGE_KEY);
  localStorage.removeItem(LEGACY_GUEST_STORAGE_KEY);
  window.dispatchEvent(new Event('avelora-cart-change'));
}

export async function loadUserCart(uid: string): Promise<CartItem[]> {
  const snapshot = await getDoc(cartDocRef(uid));
  if (!snapshot.exists()) return [];

  const data = snapshot.data() as { items?: StoredCartItem[] };
  if (!Array.isArray(data.items)) return [];

  return normalizeItems(data.items);
}

export async function saveUserCart(uid: string, items: CartItem[]) {
  await setDoc(
    cartDocRef(uid),
    {
      items,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function clearStoredCart(userId?: string) {
  if (userId) {
    await saveUserCart(userId, []);
    return;
  }

  clearGuestCart();
}

export async function mergeGuestCartIntoUser(uid: string, guestItems: CartItem[]): Promise<CartItem[]> {
  const remoteItems = await loadUserCart(uid);
  const merged = mergeCartItems(guestItems, remoteItems);
  await saveUserCart(uid, merged);
  return merged;
}

export function subscribeUserCart(uid: string, onChange: (items: CartItem[]) => void): Unsubscribe {
  return onSnapshot(
    cartDocRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange([]);
        return;
      }

      const data = snapshot.data() as { items?: StoredCartItem[] };
      onChange(Array.isArray(data.items) ? normalizeItems(data.items) : []);
    },
    (error) => {
      console.error('[cart] Firestore subscription failed:', error);
    },
  );
}
