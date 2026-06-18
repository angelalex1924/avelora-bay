import type { Metadata } from 'next';
import '@/app/styles/account.css';
import AccountContent from '@/app/components/account/account-content';
import { getTranslations } from '@/app/lib/i18n';
import { resolveLocale } from '@/app/lib/i18n/resolve-locale';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const t = getTranslations(locale);

  return {
    title: `${t.auth.myAccount} — ${t.common.brandName}`,
    description: t.accountPage.metaDescription,
  };
}

export default function AccountPage() {
  return <AccountContent />;
}
