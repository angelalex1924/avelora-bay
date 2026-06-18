import { en } from '@/app/lib/i18n/messages/en';
import { gr } from '@/app/lib/i18n/messages/gr';
import { de } from '@/app/lib/i18n/messages/de';
import type { Locale } from '@/app/lib/i18n/locales';

const catalogs = { en, gr, de } as const;

export function getTranslations(locale: Locale) {
  return catalogs[locale] ?? en;
}

export type { Locale } from '@/app/lib/i18n/locales';
export type { Translations } from '@/app/lib/i18n/types';
