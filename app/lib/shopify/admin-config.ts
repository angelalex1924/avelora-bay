import { resolveShopifyStoreDomain } from './defaults';

export type ShopifyAdminConfig = {
  storeDomain: string;
  adminAccessToken: string;
  apiVersion: string;
  webhookSecret: string;
};

export function getShopifyAdminConfig(): ShopifyAdminConfig {
  return {
    storeDomain: resolveShopifyStoreDomain(process.env.SHOPIFY_STORE_DOMAIN),
    adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ?? '',
    apiVersion: process.env.SHOPIFY_API_VERSION ?? '2026-01',
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET ?? '',
  };
}

export function isShopifyAdminConfigured(): boolean {
  const { storeDomain, adminAccessToken } = getShopifyAdminConfig();
  return Boolean(storeDomain && adminAccessToken);
}

export function getShopifyAdminGraphqlUrl(): string | null {
  const { storeDomain, apiVersion } = getShopifyAdminConfig();
  if (!storeDomain) return null;
  return `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;
}
