import { notFound } from 'next/navigation';
import { AppProviders } from '@/app/components/app-providers';
import { isLocale, type Locale } from '@/app/lib/i18n/locales';
import '@/app/styles/footer.css';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;

  return <AppProviders locale={locale}>{children}</AppProviders>;
}
