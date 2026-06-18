import { resolveShopifyStoreDomain } from './defaults';

export type ShopifyConfig = {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
  enabled: boolean;
};

export function getShopifyConfig(): ShopifyConfig {
  return {
    storeDomain: resolveShopifyStoreDomain(process.env.SHOPIFY_STORE_DOMAIN),
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? '',
    apiVersion: process.env.SHOPIFY_API_VERSION ?? '2025-01',
    enabled: process.env.NEXT_PUBLIC_SHOPIFY_ENABLED === 'true',
  };
}

export function isShopifyConfigured(): boolean {
  const { storeDomain, storefrontAccessToken, enabled } = getShopifyConfig();
  return enabled && Boolean(storeDomain && storefrontAccessToken);
}

export function getShopifyStorefrontUrl(): string | null {
  const { storeDomain, apiVersion } = getShopifyConfig();
  if (!storeDomain) return null;
  return `https://${storeDomain}/api/${apiVersion}/graphql.json`;
}
