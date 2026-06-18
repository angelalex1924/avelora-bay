import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase/client';
import type { CartItem } from '@/app/lib/cart/cart-types';
import {
  calculateOrderSubtotal,
  cartItemsToOrderItems,
  type OrderRecord,
  type StoredOrder,
} from './order-types';

function ordersCollection(userId: string) {
  return collection(db, 'users', userId, 'orders');
}

function normalizeOrder(id: string, data: StoredOrder): OrderRecord {
  const createdAt =
    data.createdAt && typeof data.createdAt.seconds === 'number'
      ? new Date(data.createdAt.seconds * 1000)
      : null;

  return {
    id,
    orderNumber: data.orderNumber,
    status: data.status,
    createdAt,
    items: data.items ?? [],
    subtotal: data.subtotal ?? 0,
    checkoutUrl: data.checkoutUrl,
    shopifyOrderId: data.shopifyOrderId,
    shopifyOrderName: data.shopifyOrderName,
    statusPageUrl: data.statusPageUrl,
  };
}

export async function createPendingOrder(
  userId: string,
  items: CartItem[],
  checkoutUrl: string,
): Promise<{ orderId: string; orderNumber: string }> {
  const orderId = crypto.randomUUID();
  const orderNumber = `AVB-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  await setDoc(doc(ordersCollection(userId), orderId), {
    orderNumber,
    status: 'pending',
    createdAt: serverTimestamp(),
    items: cartItemsToOrderItems(items),
    subtotal: calculateOrderSubtotal(items),
    checkoutUrl,
  });

  return { orderId, orderNumber };
}

export function subscribeUserOrders(
  userId: string,
  onChange: (orders: OrderRecord[]) => void,
): Unsubscribe {
  const ordersQuery = query(ordersCollection(userId), orderBy('createdAt', 'desc'));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((entry) =>
        normalizeOrder(entry.id, entry.data() as StoredOrder),
      );
      onChange(orders);
    },
    (error) => {
      console.error('[orders] Failed to load order history:', error);
      onChange([]);
    },
  );
}
