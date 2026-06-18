import type { Translations } from '@/app/lib/i18n/types';
import { PRODUCT_CATALOG } from './catalog';
import type { ShopProduct } from './types';
import { resolveShopProduct } from './resolve-catalog';
import type { ShopifyProduct } from '@/app/lib/shopify/types';
import {
  BLOCKED_SHOPIFY_HANDLES,
  isCheckoutableVariant,
  pickCheckoutableVariant,
} from '@/app/lib/shopify/variant-utils';

function formatShopifyPrice(amount: string, currencyCode: string): string {
  const value = Number.parseFloat(amount);
  if (currencyCode === 'EUR') {
    return `€${Number.isInteger(value) ? value : value.toFixed(2)}`;
  }
  return `${currencyCode} ${amount}`;
}

/** Collect purchasable variant GIDs from live Shopify catalog (skips demo traps). */
function collectCheckoutableVariants(nodes: ShopifyProduct[]): string[] {
  const variantIds: string[] = [];

  for (const node of nodes) {
    if (BLOCKED_SHOPIFY_HANDLES.has(node.handle)) continue;

    const variants = node.variants.edges.map((edge) => edge.node);
    for (const variant of variants) {
      if (isCheckoutableVariant(variant)) {
        variantIds.push(variant.id);
      }
    }
  }

  return variantIds;
}

/**
 * Keep Avelora Bay static presentation (names, images, categories) but attach
 * real in-stock Shopify variant IDs for checkout.
 */
export function mergeStaticCatalogWithShopify(
  t: Translations,
  shopifyNodes: ShopifyProduct[],
): ShopProduct[] {
  const checkoutableVariantIds = collectCheckoutableVariants(shopifyNodes);

  if (checkoutableVariantIds.length === 0) {
    return PRODUCT_CATALOG.map((entry) => resolveShopProduct(entry, t)).map((product) => ({
      ...product,
      availableForSale: false,
    }));
  }

  const byHandle = new Map(shopifyNodes.map((node) => [node.handle, node]));

  return PRODUCT_CATALOG.map((entry, index) => {
    const base = resolveShopProduct(entry, t);

    let variantId = checkoutableVariantIds[index % checkoutableVariantIds.length];
    let availableForSale = true;
    let price = base.price;

    if (entry.shopifyHandle) {
      const node = byHandle.get(entry.shopifyHandle);
      if (node && !BLOCKED_SHOPIFY_HANDLES.has(node.handle)) {
        const variants = node.variants.edges.map((edge) => edge.node);
        const picked = pickCheckoutableVariant(variants, entry.shopifyVariantIndex ?? 0);
        if (picked) {
          variantId = picked.id;
          price = formatShopifyPrice(picked.price.amount, picked.price.currencyCode);
        } else {
          availableForSale = false;
        }
      }
    }

    return {
      ...base,
      handle: entry.shopifyHandle ?? base.handle,
      variantId,
      availableForSale,
      price,
    };
  });
}
