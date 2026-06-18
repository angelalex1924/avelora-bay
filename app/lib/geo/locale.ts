export const DEFAULT_GEO_LOCALE = 'en' as const;

export const GEO_LOCALES = [
  'en',
  'el',
  'de',
  'es',
  'fr',
  'it',
  'pt',
  'nl',
  'pl',
  'tr',
  'ro',
  'bg',
  'sv',
  'no',
  'ru',
  'zh',
  'ja',
  'ar',
] as const;

export type GeoLocale = (typeof GEO_LOCALES)[number];

export const LOCALE_LABELS: Record<GeoLocale, string> = {
  en: 'English',
  el: 'Ελληνικά',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  tr: 'Türkçe',
  ro: 'Română',
  bg: 'Български',
  sv: 'Svenska',
  no: 'Norsk',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ar: 'العربية',
};

/** Primary locale offered for visitors from each country (besides English). */
export const COUNTRY_PRIMARY_LOCALE: Partial<Record<string, GeoLocale>> = {
  GR: 'el',
  CY: 'el',
  DE: 'de',
  AT: 'de',
  CH: 'de',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  FR: 'fr',
  BE: 'fr',
  LU: 'fr',
  MC: 'fr',
  IT: 'it',
  PT: 'pt',
  BR: 'pt',
  NL: 'nl',
  PL: 'pl',
  TR: 'tr',
  RO: 'ro',
  BG: 'bg',
  SE: 'sv',
  NO: 'no',
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  JP: 'ja',
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  US: 'en',
  GB: 'en',
  IE: 'en',
  AU: 'en',
  CA: 'en',
  NZ: 'en',
};

export function isGeoLocale(value: string): value is GeoLocale {
  return (GEO_LOCALES as readonly string[]).includes(value);
}

export function resolveGeoLocale(lang: string | undefined): GeoLocale {
  if (lang && isGeoLocale(lang)) {
    return lang;
  }
  return DEFAULT_GEO_LOCALE;
}

export type GeoLocaleOption = {
  code: GeoLocale;
  label: string;
};

export function getGeoLocaleOptions(country: string | null): GeoLocaleOption[] {
  const options: GeoLocaleOption[] = [{ code: 'en', label: LOCALE_LABELS.en }];
  const countryCode = country?.toUpperCase() ?? null;
  const primary = countryCode ? COUNTRY_PRIMARY_LOCALE[countryCode] : undefined;

  if (primary && primary !== 'en') {
    options.push({ code: primary, label: LOCALE_LABELS[primary] });
  }

  return options;
}

export function buildGeoUnavailableHref(country: string | null, locale: GeoLocale): string {
  const params = new URLSearchParams();
  if (country) {
    params.set('country', country);
  }
  if (locale !== DEFAULT_GEO_LOCALE) {
    params.set('lang', locale);
  }
  const query = params.toString();
  return query ? `/geo-unavailable?${query}` : '/geo-unavailable';
}
