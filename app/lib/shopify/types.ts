export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  price: ShopifyMoney;
  availableForSale: boolean;
  currentlyNotInStock?: boolean;
  quantityAvailable?: number | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  variants: { edges: { node: ShopifyProductVariant }[] };
};

export type ShopifyProductsResponse = {
  data?: {
    products: {
      edges: { node: ShopifyProduct }[];
    };
  };
  errors?: { message: string }[];
};
