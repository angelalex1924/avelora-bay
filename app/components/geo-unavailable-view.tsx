import Image from 'next/image';
import { AcronWebIcon, AcronWebWordmark } from '@/app/components/acron-web-brand';
import { ALLOWED_COUNTRIES } from '@/app/lib/geo/constants';
import {
  buildGeoUnavailableHref,
  getGeoLocaleOptions,
  type GeoLocale,
} from '@/app/lib/geo/locale';
import {
  getAllowedRegionName,
  getCountryLabel,
  getGeoCopy,
} from '@/app/lib/geo/messages';

type GeoUnavailableViewProps = {
  country: string | null;
  locale: GeoLocale;
};

export function GeoUnavailableView({ country, locale }: GeoUnavailableViewProps) {
  const t = getGeoCopy(locale);
  const countryCode = country?.toUpperCase() ?? null;
  const countryLabel = countryCode ? getCountryLabel(countryCode, locale) : null;
  const localeOptions = getGeoLocaleOptions(countryCode);

  return (
    <div className="geo-unavailable" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <aside className="geo-unavailable__hero">
        <div className="geo-unavailable__hero-glow geo-unavailable__hero-glow--1" aria-hidden />
        <div className="geo-unavailable__hero-glow geo-unavailable__hero-glow--2" aria-hidden />
        <div className="geo-unavailable__hero-grid" aria-hidden />

        <div className="geo-unavailable__hero-top">
          <div className="geo-unavailable__acron-bar">
            <div className="geo-unavailable__acron-brand">
              <div className="geo-unavailable__acron-icon-wrap">
                <AcronWebIcon className="geo-unavailable__acron-icon" gradientId="awg-geo-hero" />
              </div>
              <AcronWebWordmark variant="light" />
            </div>
            <div className="geo-unavailable__acron-nav">
              <a href="https://acronweb.gr" className="geo-unavailable__acron-pill geo-unavailable__acron-pill--sky">
                {t.homeNav}
              </a>
              <a
                href="https://acronweb.gr/epikoinonia"
                className="geo-unavailable__acron-pill geo-unavailable__acron-pill--rose"
              >
                {t.contactNav}
              </a>
            </div>
          </div>
        </div>

        <div className="geo-unavailable__hero-center">
          <div className="geo-unavailable__map-stage">
            <div className="geo-unavailable__map-ring geo-unavailable__map-ring--1" aria-hidden />
            <div className="geo-unavailable__map-ring geo-unavailable__map-ring--2" aria-hidden />
            <div className="geo-unavailable__map-glow" aria-hidden />
            <div className="geo-unavailable__map-figure">
              <Image
                src="/map.png"
                alt=""
                width={320}
                height={320}
                priority
                className="geo-unavailable__map-image"
                aria-hidden
              />
            </div>
            {ALLOWED_COUNTRIES.map((item, index) => (
              <span
                key={item.code}
                className={`geo-unavailable__map-pin geo-unavailable__map-pin--${index + 1}`}
              >
                <Image src={item.flag} alt="" width={18} height={18} className="geo-unavailable__map-pin-flag" />
                {item.code}
              </span>
            ))}
          </div>

          <div className="geo-unavailable__hero-status">
            <span className="geo-unavailable__status-pill">
              <span className="geo-unavailable__status-dot" aria-hidden />
              {t.status}
            </span>
            <h2 className="geo-unavailable__hero-badge">{t.badge}</h2>
            <p className="geo-unavailable__hero-caption">{t.mapCaption}</p>
          </div>
        </div>

        <div className="geo-unavailable__hero-infra">
          <div className="geo-unavailable__infra-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <span className="geo-unavailable__infra-label">{t.infra}</span>
            <AcronWebWordmark variant="light" className="geo-unavailable__infra-wordmark" />
          </div>
        </div>
      </aside>

      <main className="geo-unavailable__content">
        <div className="geo-unavailable__decor geo-unavailable__decor--1" aria-hidden />
        <div className="geo-unavailable__decor geo-unavailable__decor--2" aria-hidden />

        <div className="geo-unavailable__toolbar">
          <div className="geo-unavailable__avelora-brand">
            <Image src="/avelora-bay.PNG" alt="" width={42} height={42} className="geo-unavailable__avelora-icon" />
            <Image
              src="/avelora-bay-text.PNG"
              alt="Avelora Bay"
              width={168}
              height={30}
              className="geo-unavailable__avelora-wordmark"
            />
          </div>
          {localeOptions.length > 1 ? (
            <nav className="geo-unavailable__langs" aria-label={t.switchLanguage}>
              {localeOptions.map((option) => (
                <a
                  key={option.code}
                  href={buildGeoUnavailableHref(countryCode, option.code)}
                  className={`geo-unavailable__lang${locale === option.code ? ' is-active' : ''}`}
                  aria-current={locale === option.code ? 'true' : undefined}
                >
                  {option.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="geo-unavailable__main">
          <div className="geo-unavailable__traffic" aria-hidden>
            <span />
            <span />
            <span />
          </div>

          <h1 className="geo-unavailable__headline">{t.headline}</h1>
          <p className="geo-unavailable__accent">{t.accent}</p>
          <div className="geo-unavailable__rule" aria-hidden />
          <p className="geo-unavailable__description">{t.description}</p>

          {countryCode ? (
            <div className="geo-unavailable__detected-card">
              <div className="geo-unavailable__detected-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="geo-unavailable__detected-label">{t.detected}</p>
                <p className="geo-unavailable__detected-value">
                  {countryLabel ?? countryCode}
                  {countryLabel && countryLabel !== countryCode ? (
                    <span className="geo-unavailable__detected-code"> ({countryCode})</span>
                  ) : null}
                </p>
              </div>
            </div>
          ) : null}

          <div className="geo-unavailable__regions">
            <p className="geo-unavailable__regions-label">{t.availableIn}</p>
            <div className="geo-unavailable__region-cards">
              {ALLOWED_COUNTRIES.map((item) => (
                <div key={item.code} className="geo-unavailable__region-card">
                  <Image
                    src={item.flag}
                    alt=""
                    width={28}
                    height={28}
                    className="geo-unavailable__region-flag"
                  />
                  <div>
                    <span className="geo-unavailable__region-code">{item.code}</span>
                    <span className="geo-unavailable__region-name">{getAllowedRegionName(item.code, locale)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="geo-unavailable__actions">
            <a href="https://acronweb.gr/epikoinonia" className="geo-unavailable__btn geo-unavailable__btn--primary">
              {t.contact}
            </a>
            <a href="https://acronweb.gr" className="geo-unavailable__btn geo-unavailable__btn--ghost">
              {t.homeBtn}
            </a>
          </div>

          <footer className="geo-unavailable__footer-card">
            <div className="geo-unavailable__footer-brand">
              <AcronWebIcon className="geo-unavailable__footer-icon" gradientId="awg-geo-footer" />
              <div>
                <span className="geo-unavailable__footer-label">{t.protected}</span>
                <AcronWebWordmark variant="dark" className="geo-unavailable__footer-wordmark" />
              </div>
            </div>
            <p className="geo-unavailable__footer-powered">
              {t.footer}{' '}
              <a href="https://acronweb.gr" className="geo-unavailable__footer-link">
                AcronWeb
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
