import { cookies, headers } from 'next/headers';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/app/lib/i18n/locales';
import { LOCALE_HEADER, parsePathLocale, PATHNAME_HEADER } from '@/app/lib/i18n/paths';

export async function resolveLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromProxy = headerStore.get(LOCALE_HEADER);
  if (fromProxy && isLocale(fromProxy)) {
    return fromProxy;
  }

  const pathname = headerStore.get(PATHNAME_HEADER);
  if (pathname) {
    return parsePathLocale(pathname).locale;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('avelora_locale')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return DEFAULT_LOCALE;
}
