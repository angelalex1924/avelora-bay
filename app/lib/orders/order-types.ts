import type { CartItem } from '@/app/lib/cart/cart-types';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export type OrderItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
  qty: number;
  variantId?: string;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: Date | null;
  items: OrderItem[];
  subtotal: number;
  checkoutUrl?: string;
  shopifyOrderId?: string;
  shopifyOrderName?: string;
  statusPageUrl?: string;
};

export type StoredOrderItem = OrderItem;

export type StoredOrder = {
  orderNumber: string;
  status: OrderStatus;
  createdAt?: { seconds: number; nanoseconds: number } | null;
  items: StoredOrderItem[];
  subtotal: number;
  checkoutUrl?: string;
  shopifyOrderId?: string;
  shopifyOrderName?: string;
  statusPageUrl?: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
};

export function cartItemsToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    qty: item.qty,
    variantId: item.variantId,
  }));
}

function parsePrice(value: string) {
  const n = Number.parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function calculateOrderSubtotal(items: CartItem[] | OrderItem[]) {
  return items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
}
