'use client';

import { useEffect, useState } from 'react';
import { subscribeUserOrders } from '@/app/lib/orders/order-storage';
import type { OrderRecord } from '@/app/lib/orders/order-types';

export function useOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeUserOrders(userId, (next) => {
      setOrders(next);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { orders, loading };
}
