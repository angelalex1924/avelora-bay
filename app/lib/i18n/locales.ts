export const LOCALES = ['gr', 'en', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'gr';

export type LocaleOption = {
  code: Locale;
  label: string;
  shortLabel: string;
  flag: string;
};

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'gr', label: 'Ελληνικά', shortLabel: 'GR', flag: '/lang/gr.png' },
  { code: 'en', label: 'English', shortLabel: 'EN', flag: '/lang/en.png' },
  { code: 'de', label: 'Deutsch', shortLabel: 'DE', flag: '/lang/de.png' },
];

export function getLocaleOption(code: Locale): LocaleOption {
  return LOCALE_OPTIONS.find((option) => option.code === code) ?? LOCALE_OPTIONS[0];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
