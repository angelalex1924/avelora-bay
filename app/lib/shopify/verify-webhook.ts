import { createHmac, timingSafeEqual } from 'crypto';
import { getShopifyAdminConfig } from '@/app/lib/shopify/admin-config';

export function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null) {
  const { webhookSecret } = getShopifyAdminConfig();
  if (!webhookSecret || !hmacHeader) return false;

  const digest = createHmac('sha256', webhookSecret).update(rawBody, 'utf8').digest('base64');
  const digestBuffer = Buffer.from(digest, 'utf8');
  const headerBuffer = Buffer.from(hmacHeader, 'utf8');

  if (digestBuffer.length !== headerBuffer.length) return false;
  return timingSafeEqual(digestBuffer, headerBuffer);
}
