import { getShopifyConfig, getShopifyStorefrontUrl, isShopifyConfigured } from './config';
import type { ShopifyProductsResponse } from './types';

export class ShopifyNotConfiguredError extends Error {
  constructor() {
    super(
      'Shopify is not configured. Set SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, and NEXT_PUBLIC_SHOPIFY_ENABLED=true.',
    );
    this.name = 'ShopifyNotConfiguredError';
  }
}

/** Storefront token rejected — wrong token type or expired credentials. */
export class ShopifyAuthError extends Error {
  constructor() {
    super('Shopify Storefront API token rejected (401).');
    this.name = 'ShopifyAuthError';
  }
}

export function isShopifyAuthError(error: unknown): boolean {
  return error instanceof ShopifyAuthError;
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new ShopifyNotConfiguredError();
  }

  const url = getShopifyStorefrontUrl();
  const { storefrontAccessToken } = getShopifyConfig();

  if (!url) {
    throw new ShopifyNotConfiguredError();
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (response.status === 401) {
    throw new ShopifyAuthError();
  }

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as T & { errors?: { message: string }[] };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }

  return json;
}

export async function fetchShopifyProductsRaw(
  first = 50,
): Promise<ShopifyProductsResponse> {
  const { PRODUCTS_QUERY } = await import('./queries');
  return shopifyFetch<ShopifyProductsResponse>(PRODUCTS_QUERY, { first });
}
