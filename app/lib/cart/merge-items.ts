import type { CartItem } from './cart-types';

export function mergeCartItems(local: CartItem[], remote: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of remote) {
    merged.set(item.id, { ...item });
  }

  for (const item of local) {
    const existing = merged.get(item.id);

    if (!existing) {
      merged.set(item.id, { ...item });
      continue;
    }

    merged.set(item.id, {
      ...existing,
      qty: existing.qty + item.qty,
      variantId: item.variantId ?? existing.variantId,
      name: existing.name || item.name,
      price: existing.price || item.price,
      image: existing.image || item.image,
      category: existing.category ?? item.category,
    });
  }

  return Array.from(merged.values());
}
