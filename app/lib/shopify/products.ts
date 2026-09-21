import type { Locale } from '@/app/lib/i18n/locales';
import { getTranslations } from '@/app/lib/i18n';
import { mergeStaticCatalogWithShopify } from '@/app/lib/products/merge-shopify-catalog';
import { groupShopByCategory } from '@/app/lib/products/resolve-catalog';
import type { ShopCategorySection, ShopProduct } from '@/app/lib/products/types';
import { isShopifyAuthError, fetchShopifyProductsRaw } from './client';
import { isShopifyConfigured } from './config';
import { shopifyProductToShopProduct } from './adapter';
import { SHOP_CATEGORY_ORDER } from '@/app/lib/products/catalog';

export type ShopifyConnectionStatus = 'off' | 'connected' | 'auth_failed';

function buildSections(products: ShopProduct[], locale: Locale): ShopCategorySection[] {
  const t = getTranslations(locale);
  const sections: ShopCategorySection[] = [];
  const handledIds = new Set<number>();

  for (const key of SHOP_CATEGORY_ORDER) {
    const categoryProducts = products.filter((p) => p.categoryKey === key);
    if (categoryProducts.length > 0) {
      categoryProducts.forEach((p) => handledIds.add(p.id));
      sections.push({
        key,
        label: t.shopCategories[key]?.label ?? key,
        countLabel: t.shop.piecesCount.replace('{count}', String(categoryProducts.length)),
        products: categoryProducts,
      });
    }
  }

  const remaining = products.filter((p) => !handledIds.has(p.id));
  if (remaining.length > 0) {
    sections.push({
      key: 'gifts',
      label: 'Shopify Collection',
      countLabel: t.shop.piecesCount.replace('{count}', String(remaining.length)),
      products: remaining,
    });
  }

  return sections;
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
    const products =
      nodes.length > 0
        ? nodes.map(shopifyProductToShopProduct)
        : mergeStaticCatalogWithShopify(t, nodes);
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

export async function getShopProductByHandle(
  handle: string,
  locale: Locale,
): Promise<ShopProduct | null> {
  const { products } = await getShopPageData(locale);
  const normalized = decodeURIComponent(handle).toLowerCase().trim();

  return (
    products.find(
      (p) =>
        p.handle?.toLowerCase() === normalized ||
        `product-${p.id}` === normalized ||
        String(p.id) === normalized,
    ) ?? null
  );
}

