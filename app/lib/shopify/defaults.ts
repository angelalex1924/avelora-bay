/** Avelora Bay Shopify dev store — override with SHOPIFY_STORE_DOMAIN in env if needed. */
export const DEFAULT_SHOPIFY_STORE_DOMAIN = 'test-store-va4mweo3.myshopify.com';

export function resolveShopifyStoreDomain(envDomain?: string): string {
  const trimmed = envDomain?.trim();
  return trimmed || DEFAULT_SHOPIFY_STORE_DOMAIN;
}
