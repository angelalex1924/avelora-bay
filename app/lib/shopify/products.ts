import type { Locale } from '@/app/lib/i18n/locales';
import { getTranslations } from '@/app/lib/i18n';
import { mergeStaticCatalogWithShopify } from '@/app/lib/products/merge-shopify-catalog';
import { groupShopByCategory } from '@/app/lib/products/resolve-catalog';
import type { ShopCategorySection, ShopProduct } from '@/app/lib/products/types';
import { isShopifyAuthError, fetchShopifyProductsRaw } from './client';
import { isShopifyConfigured } from './config';
import { SHOP_CATEGORY_ORDER } from '@/app/lib/products/catalog';

export type ShopifyConnectionStatus = 'off' | 'connected' | 'auth_failed';

function buildSections(products: ShopProduct[], locale: Locale): ShopCategorySection[] {
  const t = getTranslations(locale);

  return SHOP_CATEGORY_ORDER.map((key) => {
    const categoryProducts = products.filter((p) => p.categoryKey === key);
    return {
      key,
      label: t.shopCategories[key]?.label ?? key,
      countLabel: t.shop.piecesCount.replace('{count}', String(categoryProducts.length)),
      products: categoryProducts,
    };
  }).filter((section) => section.products.length > 0);
}

async function loadStaticSections(locale: Locale): Promise<ShopCategorySection[]> {
  return groupShopByCategory(getTranslations(locale));
}

export async function getShopifyConnectionStatus(): Promise<ShopifyConnectionStatus> {
  if (!isShopifyConfigured()) return 'off';
  try {
    await fetchShopifyProductsRaw(1);
    return 'connected';
  } catch (error) {
    return isShopifyAuthError(error) ? 'auth_failed' : 'auth_failed';
  }
}

export async function getShopProducts(locale: Locale): Promise<ShopProduct[]> {
  const { products } = await getShopPageData(locale);
  return products;
}

/** Single Shopify fetch for shop page — Avelora catalog + live variant IDs. */
export async function getShopPageData(locale: Locale): Promise<{
  sections: ShopCategorySection[];
  shopifyStatus: ShopifyConnectionStatus;
  products: ShopProduct[];
}> {
  const t = getTranslations(locale);

  if (!isShopifyConfigured()) {
    const sections = await loadStaticSections(locale);
    return { sections, shopifyStatus: 'off', products: sections.flatMap((s) => s.products) };
  }

  try {
    const response = await fetchShopifyProductsRaw(100);
    const nodes = response.data?.products.edges.map((e) => e.node) ?? [];
    const products = mergeStaticCatalogWithShopify(t, nodes);
    const sections = buildSections(products, locale);
    return { sections, shopifyStatus: 'connected', products };
  } catch (error) {
    if (!isShopifyAuthError(error)) {
      console.warn('[shopify] Catalog fetch failed — using static fallback.');
    }
    const sections = await loadStaticSections(locale);
    return {
      sections,
      shopifyStatus: 'auth_failed',
      products: sections.flatMap((s) => s.products),
    };
  }
}

export async function getShopCategorySections(locale: Locale): Promise<ShopCategorySection[]> {
  const { sections } = await getShopPageData(locale);
  return sections;
}

export function isUsingShopify(): boolean {
  return isShopifyConfigured();
}

export async function isShopifyLive(): Promise<boolean> {
  return (await getShopifyConnectionStatus()) === 'connected';
}
