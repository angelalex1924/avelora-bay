'use client';

import { usePathname } from 'next/navigation';
import { localizePath, stripLocalePrefix } from '@/app/lib/i18n/paths';
import { useLocale } from '@/app/lib/i18n/locale-context';

export function useLocalizedPath() {
  const { locale } = useLocale();
  const pathname = usePathname();

  return {
    lp: (href: string) => localizePath(href, locale),
    barePath: stripLocalePrefix(pathname),
  };
}
