export type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
  qty: number;
  variantId?: string;
};

export type StoredCartItem = Partial<CartItem> & { quantity?: number };
