import type { CartItem } from '@/app/lib/cart/cart-context';
import { clearStoredCart } from '@/app/lib/cart/cart-storage';
import { createPendingOrder } from '@/app/lib/orders/order-storage';

export type GuestShippingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address1: string;
  city: string;
  zip: string;
  country?: string;
};

export type CheckoutOptions = {
  userId?: string;
  userEmail?: string;
  shipping?: GuestShippingDetails;
};

function buildShippingParams(shipping: GuestShippingDetails): Record<string, string> {
  return {
    'checkout[email]': shipping.email,
    'checkout[shipping_address][first_name]': shipping.firstName,
    'checkout[shipping_address][last_name]': shipping.lastName,
    'checkout[shipping_address][address1]': shipping.address1,
    'checkout[shipping_address][city]': shipping.city,
    'checkout[shipping_address][zip]': shipping.zip,
    'checkout[shipping_address][country]': shipping.country ?? 'GR',
    ...(shipping.phone ? { 'checkout[shipping_address][phone]': shipping.phone } : {}),
  };
}

function resolveVariantId(item: CartItem): string | null {
  if (item.variantId) return item.variantId;
  return null;
}

function buildCheckoutParams(options?: CheckoutOptions): Record<string, string> {
  const checkoutParams: Record<string, string> = {};

  if (options?.shipping) {
    Object.assign(checkoutParams, buildShippingParams(options.shipping));
  } else if (options?.userEmail) {
    checkoutParams['checkout[email]'] = options.userEmail;
  }

  return checkoutParams;
}

export async function startShopifyCheckout(items: CartItem[], options?: CheckoutOptions) {
  const payload = items
    .map((item) => {
      const variantId = resolveVariantId(item);
      if (!variantId) return null;
      return { variantId, quantity: item.qty };
    })
    .filter((entry): entry is { variantId: string; quantity: number } => entry !== null);

  if (payload.length === 0) {
    throw new Error('no_shopify_variants');
  }

  if (payload.length !== items.length) {
    throw new Error('items_unavailable');
  }

  const checkoutParams = buildCheckoutParams(options);

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: payload, checkoutParams }),
  });

  const data = (await response.json()) as { url?: string; error?: string; detail?: string };

  if (!response.ok || !data.url) {
    if (data.error === 'items_unavailable') {
      throw new Error('items_unavailable');
    }
    throw new Error(data.error ?? 'checkout_failed');
  }

  const checkoutUrl = data.url;

  if (options?.userId) {
    try {
      await createPendingOrder(options.userId, items, checkoutUrl);
    } catch (error) {
      console.error('[checkout] Failed to save order history:', error);
    }
  }

  try {
    await clearStoredCart(options?.userId);
  } catch (error) {
    console.error('[checkout] Failed to clear cart:', error);
  }

  window.location.href = checkoutUrl;
}
