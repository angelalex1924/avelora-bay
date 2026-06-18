import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAllowedCountry } from '@/app/lib/geo/constants';
import { localeFromCountry } from '@/app/lib/i18n/geo-locale';
import { isLocale, type Locale } from '@/app/lib/i18n/locales';
import {
  hasExplicitLocalePrefix,
  internalLocalePath,
  LOCALE_HEADER,
  localizePath,
  parsePathLocale,
  PATHNAME_HEADER,
  stripLocalePrefix,
} from '@/app/lib/i18n/paths';

const LOCALE_COOKIE = 'avelora_locale';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function resolveCountry(request: NextRequest): string | null {
  if (process.env.GEO_FORCE_COUNTRY) {
    return process.env.GEO_FORCE_COUNTRY.trim().toUpperCase();
  }

  const geoCountry = (request as NextRequest & { geo?: { country?: string | null } }).geo?.country;

  return geoCountry ?? request.headers.get('x-vercel-ip-country') ?? null;
}

function readLocaleCookie(request: NextRequest): Locale | null {
  const value = request.cookies.get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : null;
}

function shouldSkipProxy(pathname: string): boolean {
  return (
    pathname.startsWith('/geo-unavailable') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.webmanifest' ||
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

function withLocaleHeaders(request: NextRequest, locale: Locale, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  requestHeaders.set(PATHNAME_HEADER, pathname);
  return requestHeaders;
}

function attachLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipProxy(pathname)) {
    return NextResponse.next();
  }

  if (process.env.GEO_BLOCK_DISABLED !== '1') {
    const country = resolveCountry(request);
    if (country && !isAllowedCountry(country)) {
      const url = request.nextUrl.clone();
      url.pathname = '/geo-unavailable';
      url.search = '';
      url.searchParams.set('country', country);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === '/gr' || pathname.startsWith('/gr/')) {
    const url = request.nextUrl.clone();
    url.pathname = stripLocalePrefix(pathname);
    return NextResponse.redirect(url);
  }

  const urlLocale = parsePathLocale(pathname);
  const cookieLocale = readLocaleCookie(request);
  const country = resolveCountry(request);
  const geoLocale = localeFromCountry(country);

  const effectiveLocale: Locale = hasExplicitLocalePrefix(pathname)
    ? urlLocale.locale
    : (cookieLocale ?? geoLocale);

  if (!hasExplicitLocalePrefix(pathname) && effectiveLocale !== 'gr') {
    const url = request.nextUrl.clone();
    url.pathname = localizePath(urlLocale.barePath, effectiveLocale);
    const response = NextResponse.redirect(url);
    return attachLocaleCookie(response, effectiveLocale);
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = internalLocalePath(effectiveLocale, urlLocale.barePath);

  const response = NextResponse.rewrite(rewriteUrl, {
    request: { headers: withLocaleHeaders(request, effectiveLocale, pathname) },
  });

  return attachLocaleCookie(response, effectiveLocale);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
