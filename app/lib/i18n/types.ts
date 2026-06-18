import type { Messages as EnMessages } from '@/app/lib/i18n/messages/en';
import type { Locale } from '@/app/lib/i18n/locales';

export type { Locale };

type DeepStringify<T> = T extends string
  ? string
  : T extends number | boolean | null | undefined
    ? T
    : T extends readonly (infer U)[]
      ? readonly DeepStringify<U>[]
      : T extends object
        ? { readonly [K in keyof T]: DeepStringify<T[K]> }
        : T;

export type Translations = DeepStringify<EnMessages>;
