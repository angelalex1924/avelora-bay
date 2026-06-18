import { NextResponse } from 'next/server';
import { getShopifyConnectionStatus } from '@/app/lib/shopify/products';

export async function GET() {
  const status = await getShopifyConnectionStatus();
  return NextResponse.json({ status });
}
