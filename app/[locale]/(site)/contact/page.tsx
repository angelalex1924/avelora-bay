import type { Metadata } from 'next';
import '@/app/styles/contact.css';
import ContactContent from '@/app/components/contact-content';
import { getTranslations } from '@/app/lib/i18n';
import { resolveLocale } from '@/app/lib/i18n/resolve-locale';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const t = getTranslations(locale);

  return {
    title: `${t.contactPage.heroEyebrow} — ${t.common.brandName}`,
    description: t.contactPage.metaDescription,
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
