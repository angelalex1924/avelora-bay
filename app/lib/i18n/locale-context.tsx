'use client';

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { en } from '@/app/lib/i18n/messages/en';
import { gr } from '@/app/lib/i18n/messages/gr';
import { de } from '@/app/lib/i18n/messages/de';
import { localeSwitchHref, stripLocalePrefix } from '@/app/lib/i18n/paths';
import { setLocaleCookie } from '@/app/lib/i18n/set-locale-cookie';
import type { Locale } from '@/app/lib/i18n/locales';
import type { Translations } from '@/app/lib/i18n/types';

const catalogs: Record<Locale, Translations> = { en, gr, de };

type LocaleContextValue = {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'gr',
  t: gr,
  setLocale: () => {},
});

export function LocaleProvider({
  children,
  locale = 'gr',
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  const pathname = usePathname();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      setLocaleCookie(next);
      const barePath = stripLocalePrefix(pathname);
      const search = window.location.search;
      const hash = window.location.hash;
      window.location.assign(`${localeSwitchHref(barePath, next)}${search}${hash}`);
    },
    [locale, pathname],
  );

  useEffect(() => {
    document.documentElement.lang = locale === 'gr' ? 'el' : locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, t: catalogs[locale] ?? gr, setLocale }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useTranslations() {
  return useContext(LocaleContext).t;
}
