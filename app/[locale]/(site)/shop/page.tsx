import type { Metadata } from 'next';
import '@/app/styles/shop.css';
import ShopContent from '@/app/components/shop-content';
import { getShopPageData } from '@/app/lib/shopify';
import { getTranslations } from '@/app/lib/i18n';
import { resolveLocale } from '@/app/lib/i18n/resolve-locale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const t = getTranslations(locale);

  return {
    title: `${t.shop.title} — ${t.common.brandName}`,
    description: t.shop.subtitle,
  };
}

export default async function ShopPage() {
  const locale = await resolveLocale();
  const { sections, shopifyStatus } = await getShopPageData(locale);

  return <ShopContent sections={sections} shopifyStatus={shopifyStatus} />;
}
