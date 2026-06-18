import Image from 'next/image';
import { AcronWebIcon, AcronWebWordmark } from '@/app/components/acron-web-brand';
import { LOCALE_OPTIONS } from '@/app/lib/i18n/locales';
import { localeSwitchHref, localizePath } from '@/app/lib/i18n/paths';
import type { Locale, Translations } from '@/app/lib/i18n/types';

type NotFoundViewProps = {
  locale: Locale;
  t: Translations;
  attemptedPath?: string;
};

const EXPLORE_CATEGORIES = [
  {
    key: 'jewellery' as const,
    image: '/E79EE7E5-0793-4DD2-8E85-46B0C179540E.PNG',
  },
  {
    key: 'homeDecor' as const,
    image: '/map.png',
  },
  {
    key: 'candles' as const,
    image: '/F3E30515-7DB8-4948-A8C3-CDC8E310FE64.PNG',
  },
];

function truncatePath(path: string, max = 22): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1)}…`;
}

function formatAttemptedPath(slug?: string[]): string | undefined {
  if (!slug?.length) return undefined;
  return `/${slug.join('/')}`;
}

export function NotFoundView({ locale, t, attemptedPath }: NotFoundViewProps) {
  const homeHref = localizePath('/', locale);
  const shopHref = localizePath('/shop', locale);
  const storyHref = localizePath('/our-story', locale);
  const categoriesHref = localizePath('/#categories', locale);
  const bareMissingPath = attemptedPath ?? '/';
  const pathStatValue = attemptedPath ? truncatePath(attemptedPath) : '—';

  const stats = t.notFound.stats.map((stat, index) =>
    index === 1 ? { value: pathStatValue, label: t.notFound.pathLabel } : stat,
  );

  return (
    <div className="home-page not-found-page">
      <section className="hero-section not-found-hero">
        <div className="hero-section__bg" aria-hidden>
          <Image
            src="/hero-back.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-section__photo"
          />
          <div className="hero-section__shade" />
          <div className="hero-section__vignette" />
          <div className="not-found-hero__grain" />
        </div>

        <div className="container">
          <a href={homeHref} className="not-found-hero__brand" aria-label={t.common.brandName}>
            <Image
              src="/avelora-bay.PNG"
              alt=""
              width={40}
              height={40}
              aria-hidden
              className="not-found-hero__brand-icon"
            />
            <Image
              src="/avelora-bay-text.PNG"
              alt={t.common.brandName}
              width={152}
              height={28}
              className="not-found-hero__brand-wordmark"
            />
          </a>

          <div className="hero-grid">
            <div className="hero-content">
              <p className="hero-eyebrow">
                <span className="hero-eyebrow-line" aria-hidden />
                {t.notFound.eyebrow}
              </p>

              <h1 className="hero-title">
                {t.notFound.title}
                <br />
                <em>{t.notFound.titleEmphasis}</em>
              </h1>

              <p className="hero-lead">{t.notFound.subtitle}</p>

              {attemptedPath ? (
                <p className="not-found-hero__path" aria-label={t.notFound.pathLabel}>
                  <span className="not-found-hero__path-label">{t.notFound.pathLabel}</span>
                  <code className="not-found-hero__path-value">{attemptedPath}</code>
                </p>
              ) : null}

              <div className="hero-actions not-found-hero__actions">
                <a href={homeHref} className="btn btn-primary">
                  {t.common.home}
                </a>
                <a href={shopHref} className="btn btn-outline">
                  {t.common.shop}
                </a>
                <a href={storyHref} className="btn btn-ghost not-found-hero__story-btn">
                  {t.nav.ourStory}
                </a>
              </div>

              <div className="hero-stats not-found-hero__stats">
                {stats.map((stat) => (
                  <div key={stat.label} className="hero-stat">
                    <div className="hero-stat-value">{stat.value}</div>
                    <div className="hero-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-image-area not-found-hero__visual">
              <div className="hero-image-frame not-found-hero__frame">
                <Image
                  src="/IMG_1776.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 280px, 480px"
                  className="not-found-hero__frame-img object-cover"
                />
              </div>

              <div className="hero-badge not-found-hero__badge">
                <span className="hero-badge__main">404</span>
                <span className="hero-badge__sub">{t.notFound.badgeSub}</span>
              </div>

              <div className="hero-float-card not-found-hero__float">
                <p className="hero-float-card__eyebrow">{t.common.brandName}</p>
                <p className="hero-float-card__title">
                  <em>{t.notFound.floatTitle}</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        <a href="#nf-explore" className="hero-scroll not-found-hero__scroll">
          <span>{t.common.scroll}</span>
          <div className="hero-scroll-line" aria-hidden />
        </a>
      </section>

      <section id="nf-explore" className="not-found-hero__explore">
        <div className="not-found-hero__explore-wave" aria-hidden>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 28C180 8 360 48 540 28S900 8 1080 28 1260 48 1440 28V56H0V28Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="container">
          <header className="not-found-hero__explore-head">
            <div>
              <p className="featured-products__eyebrow">
                <span className="featured-products__eyebrow-line" aria-hidden />
                {t.notFound.exploreEyebrow}
              </p>
              <h2 className="featured-products__title">{t.notFound.exploreTitle}</h2>
            </div>
            <a href={shopHref} className="btn btn-outline featured-products__cta">
              {t.common.viewAll}
            </a>
          </header>

          <div className="home-categories__grid not-found-hero__cards">
            {EXPLORE_CATEGORIES.map((cat, index) => (
              <a
                key={cat.key}
                href={localizePath(`/#cat-${cat.key}`, locale)}
                className={`home-categories__card home-categories__card--${cat.key} not-found-hero__card`}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="home-categories__media">
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="home-categories__img"
                  />
                  <div className="home-categories__shade" aria-hidden />
                </div>
                <div className="home-categories__content">
                  <span className="home-categories__count">
                    {t.home.categoryCounts[cat.key as keyof typeof t.home.categoryCounts]}
                  </span>
                  <h3 className="home-categories__name">
                    {t.shopCategories[cat.key as keyof typeof t.shopCategories].label}
                  </h3>
                  <span className="home-categories__arrow" aria-hidden>
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="not-found-hero__help" aria-labelledby="nf-help-title">
        <div className="container">
          <div className="not-found-hero__help-inner">
            <div className="not-found-hero__help-copy">
              <p className="not-found-hero__help-eyebrow">{t.notFound.helpEyebrow}</p>
              <h2 id="nf-help-title" className="not-found-hero__help-title">
                {t.notFound.helpTitle}
              </h2>
              <p className="not-found-hero__help-lead">{t.notFound.helpLead}</p>

              <nav className="not-found-hero__quick-links" aria-label={t.notFound.helpEyebrow}>
                <a href={homeHref}>{t.common.home}</a>
                <a href={shopHref}>{t.common.shop}</a>
                <a href={categoriesHref}>{t.home.shopByCategory}</a>
                <a href={storyHref}>{t.nav.ourStory}</a>
              </nav>
            </div>

            <div className="not-found-hero__lang">
              <p className="not-found-hero__lang-label">{t.common.selectLanguage}</p>
              <ul className="not-found-hero__lang-list">
                {LOCALE_OPTIONS.map((option) => {
                  const isActive = option.code === locale;
                  return (
                    <li key={option.code}>
                      <a
                        href={localeSwitchHref(bareMissingPath, option.code)}
                        className={`not-found-hero__lang-link${isActive ? ' is-active' : ''}`}
                        aria-current={isActive ? 'true' : undefined}
                        hrefLang={option.code}
                      >
                        <Image
                          src={option.flag}
                          alt=""
                          width={24}
                          height={16}
                          aria-hidden
                          className="not-found-hero__lang-flag"
                        />
                        <span>{option.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="not-found-hero__foot">
        <div className="container not-found-hero__foot-inner">
          <p className="not-found-hero__foot-tagline">{t.footer.tagline}</p>
          <div className="site-footer__credit not-found-hero__credit">
            <a
              href="https://acronweb.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__credit-frame"
              aria-label={`${t.footer.poweredBy} AcronWeb`}
            >
              <span className="site-footer__credit-label">{t.footer.poweredBy}</span>
              <span className="site-footer__credit-dot" aria-hidden>
                ·
              </span>
              <AcronWebIcon
                className="site-footer__credit-icon"
                gradientId="awg-nf-credit"
                tone="avelora"
              />
              <AcronWebWordmark tone="avelora" compact className="site-footer__credit-wordmark" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { formatAttemptedPath };
