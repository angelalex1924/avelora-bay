import type { Translations } from '@/app/lib/i18n/types';
import { PRODUCT_CATALOG, SHOP_CATEGORY_ORDER, STATIC_PRODUCT_COPY } from './catalog';
import type { ShopCategorySection, ShopProduct } from './types';

function getMockVariantId(): string | undefined {
  const id =
    process.env.SHOPIFY_MOCK_VARIANT_ID?.trim() ||
    process.env.NEXT_PUBLIC_SHOPIFY_MOCK_VARIANT_ID?.trim();
  return id || undefined;
}

export function resolveShopProduct(
  entry: (typeof PRODUCT_CATALOG)[number],
  t: Translations,
): ShopProduct {
  const items = t.product.items;
  const item = items[String(entry.id) as keyof typeof items];
  const fallback = STATIC_PRODUCT_COPY[entry.id];
  const mockVariantId = getMockVariantId();

  return {
    id: entry.id,
    name: item?.name ?? fallback?.name ?? `Product ${entry.id}`,
    category: item?.category ?? fallback?.category ?? 'Collection',
    categoryKey: entry.categoryKey,
    price: entry.price,
    image: entry.image,
    badge: entry.badgeKey ? t.badges[entry.badgeKey] : null,
    availableForSale: true,
    variantId: mockVariantId,
  };
}

export function resolveShopCatalog(t: Translations): ShopProduct[] {
  return PRODUCT_CATALOG.map((entry) => resolveShopProduct(entry, t));
}

export function groupShopByCategory(t: Translations): ShopCategorySection[] {
  const products = resolveShopCatalog(t);

  return SHOP_CATEGORY_ORDER.map((key) => {
    const categoryProducts = products.filter((p) => p.categoryKey === key);
    const countLabel = t.shop.piecesCount.replace('{count}', String(categoryProducts.length));

    return {
      key,
      label: t.shopCategories[key]?.label ?? key,
      countLabel,
      products: categoryProducts,
    };
  }).filter((section) => section.products.length > 0);
}
