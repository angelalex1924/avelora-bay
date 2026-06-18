import type { ProductCategoryKey, ShopProduct } from '@/app/lib/products/types';
import type { ShopifyProduct } from './types';
import { pickCheckoutableVariant } from './variant-utils';

const TAG_TO_CATEGORY: Record<string, ProductCategoryKey> = {
  jewellery: 'jewellery',
  jewelry: 'jewellery',
  'home-decor': 'homeDecor',
  homedecor: 'homeDecor',
  candles: 'candles',
  scents: 'candles',
  textiles: 'textiles',
  gifts: 'gifts',
  'gift-sets': 'gifts',
};

function inferCategoryKey(product: ShopifyProduct): ProductCategoryKey {
  for (const tag of product.tags) {
    const key = TAG_TO_CATEGORY[tag.toLowerCase()];
    if (key) return key;
  }

  const type = product.productType.toLowerCase();
  for (const [needle, key] of Object.entries(TAG_TO_CATEGORY)) {
    if (type.includes(needle)) return key;
  }

  return 'gifts';
}

function formatShopifyPrice(amount: string, currencyCode: string): string {
  const value = parseFloat(amount);
  if (currencyCode === 'EUR') {
    return `€${Number.isInteger(value) ? value : value.toFixed(2)}`;
  }
  return `${currencyCode} ${amount}`;
}

export function shopifyProductToShopProduct(node: ShopifyProduct): ShopProduct {
  const variants = node.variants.edges.map((edge) => edge.node);
  const variant = pickCheckoutableVariant(variants);
  const price = variant
    ? formatShopifyPrice(variant.price.amount, variant.price.currencyCode)
    : '€0';

  const numericId = parseInt(node.id.split('/').pop() || '0', 10);

  return {
    id: numericId,
    handle: node.handle,
    name: node.title,
    category: node.productType || inferCategoryKey(node),
    categoryKey: inferCategoryKey(node),
    price,
    image: node.featuredImage?.url ?? '/hero-back.jpg',
    badge: node.tags.some((t) => t.toLowerCase() === 'new')
      ? 'New'
      : node.tags.some((t) => t.toLowerCase() === 'bestseller')
        ? 'Bestseller'
        : null,
    description: node.description,
    variantId: variant?.id,
    availableForSale: Boolean(variant),
  };
}
