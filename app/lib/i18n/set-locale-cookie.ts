import type { Locale } from '@/app/lib/i18n/locales';

const COOKIE_NAME = 'avelora_locale';
const MAX_AGE = 60 * 60 * 24 * 365;

export function setLocaleCookie(locale: Locale) {
  document.cookie = `${COOKIE_NAME}=${locale};path=/;max-age=${MAX_AGE};SameSite=Lax`;
}
