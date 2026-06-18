import type { Metadata } from 'next';
import { GeoUnavailableView } from '@/app/components/geo-unavailable-view';
import { resolveGeoLocale } from '@/app/lib/geo/locale';

export const metadata: Metadata = {
  title: 'Avelora Bay — Region unavailable',
  description: 'This store is not available in your country.',
  robots: { index: false, follow: false },
};

type GeoUnavailablePageProps = {
  searchParams: Promise<{ country?: string; lang?: string }>;
};

export default async function GeoUnavailablePage({ searchParams }: GeoUnavailablePageProps) {
  const params = await searchParams;
  const country = params.country?.trim().toUpperCase() || null;
  const locale = resolveGeoLocale(params.lang);

  return <GeoUnavailableView country={country} locale={locale} />;
}
