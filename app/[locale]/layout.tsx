import type { Locale } from '@/app/lib/i18n/locales';
import { LOCALES } from '@/app/lib/i18n/locales';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleSegmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
