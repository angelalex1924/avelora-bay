import type { ShopifyProductVariant } from './types';

/** Demo / broken products that fail at checkout even when Storefront says available. */
export const BLOCKED_SHOPIFY_HANDLES = new Set([
  'gift-card',
  'the-inventory-not-tracked-snowboard',
  'the-out-of-stock-snowboard',
]);

export function isCheckoutableVariant(variant: ShopifyProductVariant): boolean {
  if (!variant.availableForSale) return false;
  if (variant.currentlyNotInStock) return false;
  return true;
}

export function pickCheckoutableVariant(
  variants: ShopifyProductVariant[],
  preferredIndex = 0,
): ShopifyProductVariant | null {
  const eligible = variants.filter(isCheckoutableVariant);
  if (eligible.length === 0) return null;
  return eligible[preferredIndex] ?? eligible[0] ?? null;
}

export function toVariantGid(variantId: string): string {
  if (variantId.startsWith('gid://')) return variantId;
  return `gid://shopify/ProductVariant/${variantId}`;
}
