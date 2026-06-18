import type { Locale } from '@/app/lib/i18n/locales';

/** Default site locale from visitor country when no URL prefix or cookie is set. */
export function localeFromCountry(country: string | null | undefined): Locale {
  const code = country?.toUpperCase();
  if (code === 'GR' || code === 'CY') return 'gr';
  if (code === 'DE') return 'de';
  return 'en';
}
