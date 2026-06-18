export type ProductCategoryKey =
  | 'jewellery'
  | 'homeDecor'
  | 'candles'
  | 'textiles'
  | 'gifts';

export type CatalogProduct = {
  id: number;
  categoryKey: ProductCategoryKey;
  image: string;
  price: string;
  badgeKey: 'new' | 'bestseller' | null;
  /** Live Shopify product handle for checkout variant mapping */
  shopifyHandle?: string;
  /** Which in-stock variant to use when a handle has multiple options */
  shopifyVariantIndex?: number;
};

export type ShopProduct = {
  id: number;
  handle?: string;
  name: string;
  category: string;
  categoryKey: ProductCategoryKey;
  price: string;
  image: string;
  badge: string | null;
  description?: string;
  variantId?: string;
  availableForSale?: boolean;
};

export type ShopCategorySection = {
  key: ProductCategoryKey;
  label: string;
  countLabel: string;
  products: ShopProduct[];
};
