'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/app/components/product-card';
import { HeroPromoCarousel } from '@/app/components/hero-promo-carousel';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

const categoryHrefs: Record<string, string> = {
  jewellery: '/shop/jewellery',
  homeDecor: '/shop/home-decor',
  candles: '/shop/candles-scents',
  textiles: '/shop/textiles',
  gifts: '/shop/gift-sets',
  newArrivals: '/shop/new-arrivals',
};

const categoryImages: Record<string, string> = {
  jewellery: '/E79EE7E5-0793-4DD2-8E85-46B0C179540E.PNG',
  homeDecor: '/map.png',
  candles: '/F3E30515-7DB8-4948-A8C3-CDC8E310FE64.PNG',
  textiles: '/IMG_1776.jpg',
  gifts: '/C3C8048A-9FAE-4DF9-8573-48242A97EF00.PNG',
  newArrivals: '/hero-back.jpg',
};

export default function HomeContent() {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const h = t.home;

  const heroStatRows: [string, string][] = [
    ['100+', h.statPieces],
    ['4.9★', h.statRating],
    [h.statFree, h.statShipping],
  ];

  return (
    <>
      <section id="hero" className="hero-section" data-nav-hero data-nav-theme="light">
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
          <div className="hero-section__vignette" aria-hidden />
        </div>

        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-visual__desktop">
                <header className="hero-mobile-brand">
                  <Image
                    src="/avelora-bay.PNG"
                    alt=""
                    width={40}
                    height={40}
                    priority
                    aria-hidden
                    className="hero-mobile-brand__icon"
                  />
                  <Image
                    src="/avelora-bay-text.PNG"
                    alt={t.common.brandName}
                    width={152}
                    height={28}
                    priority
                    className="hero-mobile-brand__wordmark"
                  />
                </header>

                <div className="hero-content__intro">
                  <p className="hero-eyebrow">
                    <span className="hero-eyebrow-line" />
                    {h.heroEyebrow}
                  </p>

                  <h1 className="hero-title">
                    {h.heroTitleLine1}
                    <br />
                    <em>{h.heroTitleEmphasis}</em>
                    <br />
                    {h.heroTitleLine3}
                  </h1>
                </div>
              </div>

              <div className="hero-body">
                <p className="hero-lead">{h.heroLead}</p>

                <div className="hero-actions">
                  <Link id="hero-shop-btn" href={lp('/shop')} className="btn btn-primary">
                    {h.exploreCollection}
                  </Link>
                  <Link id="hero-story-btn" href={lp('/our-story')} className="btn btn-outline">
                    {h.ourStory}
                  </Link>
                </div>

                <div className="hero-stats">
                  {heroStatRows.map(([val, label]) => (
                    <div key={label} className="hero-stat">
                      <div className="hero-stat-value">{val}</div>
                      <div className="hero-stat-label">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 w-full max-md:overflow-hidden md:flex md:min-h-[min(72vh,640px)] md:items-center md:justify-center md:overflow-visible max-md:order-first max-md:pointer-events-auto">
              <HeroPromoCarousel
                promos={h.heroPromos}
                brandName={t.common.brandName}
                floatEyebrow={h.justArrived}
              />
            </div>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden>
          <span>{t.common.scroll}</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      <section id="categories" className="home-categories">
        <div className="container">
          <header className="home-categories__header">
            <p className="home-categories__eyebrow">
              <span className="home-categories__eyebrow-line" aria-hidden />
              {h.shopByCategory}
            </p>
            <h2 className="home-categories__title">{h.discoverTreasure}</h2>
          </header>

          <div className="home-categories__grid">
            {h.categories.map((cat) => (
              <Link
                key={cat.key}
                id={`cat-${cat.key}`}
                href={lp(categoryHrefs[cat.key])}
                className={`home-categories__card home-categories__card--${cat.key}`}
              >
                <div className="home-categories__media">
                  <Image
                    src={categoryImages[cat.key]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 28vw"
                    className="home-categories__img"
                  />
                  <div className="home-categories__shade" aria-hidden />
                </div>
                <div className="home-categories__content">
                  <span className="home-categories__count">
                    {h.categoryCounts[cat.key as keyof typeof h.categoryCounts]}
                  </span>
                  <h3 className="home-categories__name">{cat.name}</h3>
                  <span className="home-categories__arrow" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-products" className="featured-products">
        <div className="container">
          <header className="featured-products__header">
            <div className="featured-products__intro">
              <p className="featured-products__eyebrow">
                <span className="featured-products__eyebrow-line" aria-hidden />
                {h.curatedForYou}
                <span className="featured-products__eyebrow-line" aria-hidden />
              </p>
              <h2 className="featured-products__title">{h.featuredPieces}</h2>
            </div>
            <Link id="view-all-btn" href={lp('/shop')} className="btn btn-outline featured-products__cta">
              {t.common.viewAll}
            </Link>
          </header>

          <div className="featured-products__grid">
            {h.featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  badge: product.badgeKey
                    ? t.badges[product.badgeKey as keyof typeof t.badges]
                    : null,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="brand-story" className="brand-story-section" data-nav-theme="dark">
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              border: '1px solid rgba(184,150,110,0.08)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              border: '1px solid rgba(184,150,110,0.05)',
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Image
            src="/avelora-bay.PNG"
            alt={t.common.brandName}
            width={80}
            height={80}
            style={{
              margin: '0 auto 2rem',
              objectFit: 'contain',
              filter: 'brightness(1.8) sepia(0.4)',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold-light)',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}
          >
            {h.philosophy}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 300,
              color: 'var(--sand-light)',
              lineHeight: 1.2,
              maxWidth: '700px',
              margin: '0 auto 2rem',
            }}
          >
            {h.brandStoryTitle}
            <br />
            <em style={{ color: 'var(--gold-light)' }}>{h.brandStoryEmphasis}</em>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              color: 'rgba(242,236,227,0.6)',
              lineHeight: 1.9,
              maxWidth: '520px',
              margin: '0 auto 2.5rem',
              fontWeight: 300,
            }}
          >
            {h.brandStoryBody}
          </p>
          <Link
            id="our-story-btn"
            href={lp('/our-story')}
            className="btn btn-outline"
            style={{ color: 'var(--gold-light)', borderColor: 'var(--gold-light)' }}
          >
            {h.discoverOurStory}
          </Link>
        </div>
      </section>

      <section id="testimonials" style={{ padding: '5rem 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '0.75rem',
                fontWeight: 600,
              }}
            >
              {h.customerLove}
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: 'var(--charcoal)',
              }}
            >
              {h.storiesFromShore}
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {h.testimonials.map((review, i) => (
              <div
                key={i}
                id={`review-${i + 1}`}
                style={{
                  background: 'var(--sand-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  border: '1px solid var(--sand-dark)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    color: 'var(--gold)',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    letterSpacing: '2px',
                  }}
                >
                  {'★'.repeat(5)}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    color: 'var(--charcoal)',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                    marginBottom: '1.5rem',
                  }}
                >
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      color: 'var(--taupe-dark)',
                    }}
                  >
                    {review.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--taupe)', letterSpacing: '0.1em' }}>
                    {review.location}
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    fontFamily: 'Georgia',
                    fontSize: '4rem',
                    color: 'var(--gold)',
                    opacity: 0.12,
                    lineHeight: 1,
                  }}
                >
                  &ldquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
