import type { Locale } from '@/app/lib/i18n/locales';

export const LOCALE_HEADER = 'x-avelora-locale';
export const PATHNAME_HEADER = 'x-avelora-pathname';

const PREFIXED_LOCALES = ['en', 'de'] as const;

export function stripLocalePrefix(pathname: string): string {
  for (const code of PREFIXED_LOCALES) {
    if (pathname === `/${code}`) return '/';
    if (pathname.startsWith(`/${code}/`)) {
      return pathname.slice(code.length + 1) || '/';
    }
  }
  if (pathname === '/gr' || pathname.startsWith('/gr/')) {
    return pathname.replace(/^\/gr/, '') || '/';
  }
  return pathname;
}

export function parsePathLocale(pathname: string): { locale: Locale; barePath: string } {
  for (const code of PREFIXED_LOCALES) {
    if (pathname === `/${code}` || pathname.startsWith(`/${code}/`)) {
      return { locale: code, barePath: stripLocalePrefix(pathname) };
    }
  }
  if (pathname === '/gr' || pathname.startsWith('/gr/')) {
    return { locale: 'gr', barePath: stripLocalePrefix(pathname) };
  }
  return { locale: 'gr', barePath: pathname || '/' };
}

export function hasExplicitLocalePrefix(pathname: string): boolean {
  return PREFIXED_LOCALES.some(
    (code) => pathname === `/${code}` || pathname.startsWith(`/${code}/`),
  );
}

export function localizePath(path: string, locale: Locale): string {
  const hashIndex = path.indexOf('#');
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const pathOnly = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const bare = stripLocalePrefix(pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`);

  if (locale === 'gr') {
    return `${bare}${hash}`;
  }

  const localized = bare === '/' ? `/${locale}` : `/${locale}${bare}`;
  return `${localized}${hash}`;
}

export function localeSwitchHref(barePath: string, targetLocale: Locale): string {
  return localizePath(barePath, targetLocale);
}

export function internalLocalePath(locale: Locale, barePath: string): string {
  const normalized = barePath.startsWith('/') ? barePath : `/${barePath}`;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}
