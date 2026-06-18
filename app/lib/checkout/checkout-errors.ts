export type CheckoutErrorCode = 'no_variants' | 'items_unavailable' | 'failed';

export function mapCheckoutError(message: string): CheckoutErrorCode {
  if (message === 'no_shopify_variants') return 'no_variants';
  if (message === 'items_unavailable') return 'items_unavailable';
  return 'failed';
}
