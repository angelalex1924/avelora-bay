import { NextResponse } from 'next/server';
import { syncShopifyWebhookOrder, type ShopifyWebhookOrder } from '@/app/lib/orders/sync-shopify-order';
import { verifyShopifyWebhook } from '@/app/lib/shopify/verify-webhook';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const hmac = req.headers.get('x-shopify-hmac-sha256');

    if (!verifyShopifyWebhook(rawBody, hmac)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const topic = req.headers.get('x-shopify-topic');
    if (topic !== 'orders/paid' && topic !== 'orders/updated' && topic !== 'orders/create') {
      return NextResponse.json({ ok: true, ignored: topic });
    }

    const order = JSON.parse(rawBody) as ShopifyWebhookOrder;
    const result = await syncShopifyWebhookOrder(order);

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('[webhook/shopify/orders]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
