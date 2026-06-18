import { shopifyFetch } from './client';
import { CART_CREATE_MUTATION } from './queries';
import { toVariantGid } from './variant-utils';

type CartLine = {
  variantId: string;
  quantity: number;
};

type CartCreateResponse = {
  data?: {
    cartCreate?: {
      cart?: { checkoutUrl?: string | null } | null;
      userErrors?: { field?: string[] | null; message: string }[];
    };
  };
};

export async function createShopifyCheckoutUrl(lines: CartLine[]): Promise<string> {
  const response = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION, {
    input: {
      lines: lines.map((line) => ({
        merchandiseId: toVariantGid(line.variantId),
        quantity: line.quantity,
      })),
    },
  });

  const result = response.data?.cartCreate;
  const userErrors = result?.userErrors ?? [];

  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join('; '));
  }

  const checkoutUrl = result?.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error('checkout_unavailable');
  }

  return checkoutUrl;
}
