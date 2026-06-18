import { getShopifyAdminConfig, getShopifyAdminGraphqlUrl, isShopifyAdminConfigured } from './admin-config';
import { SHOPIFY_ORDER_RECEIPT_QUERY } from './admin-queries';

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyReceiptLineItem = {
  name: string;
  quantity: number;
  unitPrice: ShopifyMoney;
  lineTotal: ShopifyMoney;
};

export type ShopifyReceiptTaxLine = {
  title: string;
  ratePercentage: number | null;
  amount: ShopifyMoney;
};

export type ShopifyReceiptOrder = {
  id: string;
  name: string;
  processedAt: string | null;
  createdAt: string;
  statusPageUrl: string | null;
  email: string | null;
  displayFinancialStatus: string | null;
  displayFulfillmentStatus: string | null;
  subtotal: ShopifyMoney;
  total: ShopifyMoney;
  totalTax: ShopifyMoney;
  totalShipping: ShopifyMoney;
  billingAddress: {
    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    zip: string | null;
    country: string | null;
    phone: string | null;
  } | null;
  lineItems: ShopifyReceiptLineItem[];
  taxLines: ShopifyReceiptTaxLine[];
};

export type ShopifyReceiptShop = {
  name: string;
  contactEmail: string | null;
  billingAddress: {
    address1: string | null;
    address2: string | null;
    city: string | null;
    zip: string | null;
    country: string | null;
  } | null;
};

type GraphqlMoneySet = {
  shopMoney: ShopifyMoney;
};

type GraphqlOrderResponse = {
  data?: {
    order: {
      id: string;
      name: string;
      processedAt: string | null;
      createdAt: string;
      statusPageUrl: string | null;
      email: string | null;
      displayFinancialStatus: string | null;
      displayFulfillmentStatus: string | null;
      subtotalPriceSet: GraphqlMoneySet;
      totalPriceSet: GraphqlMoneySet;
      totalTaxSet: GraphqlMoneySet;
      totalShippingPriceSet: GraphqlMoneySet;
      billingAddress: ShopifyReceiptOrder['billingAddress'];
      lineItems: {
        edges: Array<{
          node: {
            name: string;
            quantity: number;
            originalUnitPriceSet: GraphqlMoneySet;
            discountedTotalSet: GraphqlMoneySet;
          };
        }>;
      };
      taxLines: Array<{
        title: string;
        rate: number | null;
        ratePercentage: number | null;
        priceSet: GraphqlMoneySet;
      }>;
    } | null;
    shop: ShopifyReceiptShop;
  };
  errors?: Array<{ message: string }>;
};

function toShopifyOrderGid(shopifyOrderId: string) {
  if (shopifyOrderId.startsWith('gid://')) return shopifyOrderId;
  return `gid://shopify/Order/${shopifyOrderId}`;
}

export async function fetchShopifyOrderReceipt(
  shopifyOrderId: string,
): Promise<{ order: ShopifyReceiptOrder; shop: ShopifyReceiptShop } | null> {
  if (!isShopifyAdminConfigured()) return null;

  const url = getShopifyAdminGraphqlUrl();
  const { adminAccessToken } = getShopifyAdminConfig();
  if (!url) return null;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    },
    body: JSON.stringify({
      query: SHOPIFY_ORDER_RECEIPT_QUERY,
      variables: { id: toShopifyOrderGid(shopifyOrderId) },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Shopify Admin API error (${response.status})`);
  }

  const payload = (await response.json()) as GraphqlOrderResponse;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((entry) => entry.message).join('; '));
  }

  const order = payload.data?.order;
  const shop = payload.data?.shop;
  if (!order || !shop) return null;

  return {
    order: {
      id: order.id,
      name: order.name,
      processedAt: order.processedAt,
      createdAt: order.createdAt,
      statusPageUrl: order.statusPageUrl,
      email: order.email,
      displayFinancialStatus: order.displayFinancialStatus,
      displayFulfillmentStatus: order.displayFulfillmentStatus,
      subtotal: order.subtotalPriceSet.shopMoney,
      total: order.totalPriceSet.shopMoney,
      totalTax: order.totalTaxSet.shopMoney,
      totalShipping: order.totalShippingPriceSet.shopMoney,
      billingAddress: order.billingAddress,
      lineItems: order.lineItems.edges.map(({ node }) => ({
        name: node.name,
        quantity: node.quantity,
        unitPrice: node.originalUnitPriceSet.shopMoney,
        lineTotal: node.discountedTotalSet.shopMoney,
      })),
      taxLines: order.taxLines.map((line) => ({
        title: line.title,
        ratePercentage: line.ratePercentage,
        amount: line.priceSet.shopMoney,
      })),
    },
    shop,
  };
}
