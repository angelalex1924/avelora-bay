import { NextResponse } from 'next/server';
import { createShopifyCheckoutUrl } from '@/app/lib/shopify/cart';
import { isShopifyConfigured } from '@/app/lib/shopify/config';
import { ShopifyAuthError, ShopifyNotConfiguredError } from '@/app/lib/shopify/client';
import { resolveShopifyStoreDomain } from '@/app/lib/shopify/defaults';

type CheckoutItem = {
  variantId: string;
  quantity: number;
};

type CheckoutBody = {
  items?: CheckoutItem[];
  checkoutParams?: Record<string, string>;
};

function appendCheckoutParams(baseUrl: string, params: Record<string, string>) {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

/** Legacy cart permalink fallback when Storefront cartCreate is unavailable. */
function buildLegacyCartUrl(storeDomain: string, items: CheckoutItem[]) {
  const cartItems = items
    .map((item) => {
      const numericVariantId = item.variantId.includes('/')
        ? item.variantId.split('/').pop()
        : item.variantId;
      const qty = Number.parseInt(String(item.quantity), 10) || 1;
      return `${numericVariantId}:${qty}`;
    })
    .join(',');

  return `https://${storeDomain}/cart/${cartItems}`;
}

export async function POST(req: Request) {
  try {
    const { items, checkoutParams } = (await req.json()) as CheckoutBody;

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const storeDomain = resolveShopifyStoreDomain(process.env.SHOPIFY_STORE_DOMAIN);
    let checkoutUrl: string;

    if (isShopifyConfigured()) {
      try {
        checkoutUrl = await createShopifyCheckoutUrl(items);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'checkout_failed';
        if (message.includes('merchandise') || message.includes('available')) {
          return NextResponse.json({ error: 'items_unavailable', detail: message }, { status: 409 });
        }
        return NextResponse.json({ error: message }, { status: 502 });
      }
    } else {
      checkoutUrl = buildLegacyCartUrl(storeDomain, items);
    }

    if (checkoutParams && Object.keys(checkoutParams).length > 0) {
      checkoutUrl = appendCheckoutParams(checkoutUrl, checkoutParams);
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    if (error instanceof ShopifyNotConfiguredError || error instanceof ShopifyAuthError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error('[checkout]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
