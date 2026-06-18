import { NotFoundView } from '@/app/components/not-found-view';
import { getTranslations } from '@/app/lib/i18n';
import { resolveNotFoundLocale } from '@/app/lib/i18n/resolve-not-found-locale';
import '@/app/styles/home.css';
import '@/app/styles/footer.css';
import '@/app/styles/not-found.css';

export default async function RootNotFound() {
  const locale = await resolveNotFoundLocale();
  const t = getTranslations(locale);

  return <NotFoundView locale={locale} t={t} />;
}
