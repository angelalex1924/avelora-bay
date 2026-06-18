import type { Metadata } from 'next';
import '@/app/styles/account.css';
import OrdersContent from '@/app/components/account/orders-content';
import { getTranslations } from '@/app/lib/i18n';
import { resolveLocale } from '@/app/lib/i18n/resolve-locale';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const t = getTranslations(locale);

  return {
    title: `${t.ordersPage.title} — ${t.common.brandName}`,
    description: t.ordersPage.subtitle,
  };
}

export default function AccountOrdersPage() {
  return <OrdersContent />;
}
