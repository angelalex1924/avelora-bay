'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/app/lib/auth/auth-context';
import {
  clearGuestCart,
  mergeGuestCartIntoUser,
  readGuestCart,
  saveUserCart,
  subscribeUserCart,
  writeGuestCart,
} from '@/app/lib/cart/cart-storage';
import type { CartItem } from '@/app/lib/cart/cart-types';

export type { CartItem } from '@/app/lib/cart/cart-types';

type AddCartItemInput = Omit<CartItem, 'qty'> & { qty?: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function parsePrice(value: string) {
  const n = Number.parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const itemsRef = useRef<CartItem[]>([]);
  const uidRef = useRef<string | null>(null);
  const skipPersistRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  itemsRef.current = items;

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function syncCartWithAuth() {
      skipPersistRef.current = true;
      setReady(false);

      unsubscribeRef.current?.();
      unsubscribeRef.current = null;

      const previousUid = uidRef.current;
      const nextUid = user?.uid ?? null;

      try {
        if (nextUid) {
          if (previousUid !== nextUid) {
            const guestItems = previousUid === null ? readGuestCart() : [];

            if (guestItems.length > 0) {
              await mergeGuestCartIntoUser(nextUid, guestItems);
              clearGuestCart();
            }
          }

          uidRef.current = nextUid;

          unsubscribeRef.current = subscribeUserCart(nextUid, (remoteItems) => {
            if (cancelled) return;

            skipPersistRef.current = true;
            setItems(remoteItems);
            itemsRef.current = remoteItems;
            requestAnimationFrame(() => {
              skipPersistRef.current = false;
            });
          });
        } else {
          uidRef.current = null;

          if (previousUid) {
            clearGuestCart();
            if (!cancelled) {
              setItems([]);
              itemsRef.current = [];
            }
          } else if (!cancelled) {
            const guestItems = readGuestCart();
            setItems(guestItems);
            itemsRef.current = guestItems;
          }
        }
      } catch (error) {
        console.error('[cart] Failed to sync cart with auth:', error);

        if (!cancelled) {
          const fallback = nextUid ? [] : readGuestCart();
          setItems(fallback);
          itemsRef.current = fallback;
        }
      } finally {
        if (!cancelled) {
          skipPersistRef.current = false;
          setReady(true);
        }
      }
    }

    void syncCartWithAuth();

    return () => {
      cancelled = true;
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [user?.uid, authLoading]);

  useEffect(() => {
    if (user?.uid) return;

    const onGuestCartChange = () => {
      if (skipPersistRef.current) return;
      const guestItems = readGuestCart();
      setItems(guestItems);
      itemsRef.current = guestItems;
    };

    window.addEventListener('avelora-cart-change', onGuestCartChange);
    window.addEventListener('storage', onGuestCartChange);

    return () => {
      window.removeEventListener('avelora-cart-change', onGuestCartChange);
      window.removeEventListener('storage', onGuestCartChange);
    };
  }, [user?.uid]);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    itemsRef.current = next;

    if (skipPersistRef.current) return;

    const uid = uidRef.current;
    if (uid) {
      void saveUserCart(uid, next).catch((error) => {
        console.error('[cart] Failed to save user cart:', error);
      });
      return;
    }

    writeGuestCart(next);
  }, []);

  const addItem = useCallback(
    (item: AddCartItemInput) => {
      const id = String(item.id);
      const qty = item.qty ?? 1;
      const existing = itemsRef.current.find((entry) => entry.id === id);

      if (existing) {
        persist(
          itemsRef.current.map((entry) =>
            entry.id === id
              ? { ...entry, qty: entry.qty + qty, variantId: item.variantId ?? entry.variantId }
              : entry,
          ),
        );
        return;
      }

      persist([...itemsRef.current, { ...item, id, qty }]);
    },
    [persist],
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(itemsRef.current.filter((item) => item.id !== id));
    },
    [persist],
  );

  const updateQty = useCallback(
    (id: string, qty: number) => {
      if (qty <= 0) {
        persist(itemsRef.current.filter((item) => item.id !== id));
        return;
      }

      persist(itemsRef.current.map((item) => (item.id === id ? { ...item, qty } : item)));
    },
    [persist],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);

  const value = useMemo(
    () => ({ items, count, subtotal, ready, addItem, removeItem, updateQty, clearCart }),
    [items, count, subtotal, ready, addItem, removeItem, updateQty, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
