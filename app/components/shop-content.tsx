'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/app/components/product-card';
import { CATEGORY_SECTION_IMAGES } from '@/app/lib/products/catalog';
import type { ShopCategorySection } from '@/app/lib/products/types';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

import type { ShopifyConnectionStatus } from '@/app/lib/shopify/products';

type ShopContentProps = {
  sections: ShopCategorySection[];
  shopifyStatus: ShopifyConnectionStatus;
};

export default function ShopContent({ sections, shopifyStatus }: ShopContentProps) {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const s = t.shop;
  const totalProducts = sections.reduce((sum, section) => sum + section.products.length, 0);
  const mosaicKeys = sections.slice(0, 3).map((section) => section.key);

  const heroStats = [
    [String(sections.length), s.statCollections],
    [String(totalProducts), s.statProducts],
    [t.home.statFree, t.home.statShipping],
  ];

  return (
    <div className="shop-page" data-nav-theme="light">
      <section className="shop-page__hero">
        <div className="shop-page__hero-bg" aria-hidden>
          <Image
            src="/hero-back.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="shop-page__hero-photo"
          />
          <div className="shop-page__hero-shade" />
          <div className="shop-page__hero-vignette" />
          <div className="shop-page__hero-grain" />
        </div>

        <div className="container">
          <div className="shop-page__hero-grid">
            <div className="shop-page__hero-content">
              <p className="hero-eyebrow">
                <span className="hero-eyebrow-line" aria-hidden />
                {s.heroEyebrow}
              </p>

              <h1 className="hero-title shop-page__hero-title">
                {s.heroTitleLine1}
                <br />
                <em>{s.heroTitleEmphasis}</em>
              </h1>

              <p className="hero-lead shop-page__hero-lead">{s.subtitle}</p>

              <div className="hero-stats shop-page__hero-stats">
                {heroStats.map(([value, label]) => (
                  <div key={label} className="hero-stat">
                    <div className="hero-stat-value">{value}</div>
                    <div className="hero-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shop-page__hero-visual" aria-hidden>
              <div className="shop-page__hero-mosaic">
                {mosaicKeys.map((key, index) => (
                  <div
                    key={key}
                    className={`shop-page__hero-tile shop-page__hero-tile--${index + 1}`}
                  >
                    <Image
                      src={CATEGORY_SECTION_IMAGES[key]}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 40vw, 220px"
                      className="shop-page__hero-tile-img"
                    />
                  </div>
                ))}
              </div>

              <div className="hero-badge shop-page__hero-badge">
                <span className="hero-badge__main">{totalProducts}</span>
                <span className="hero-badge__sub">{s.allProducts}</span>
              </div>

              <div className="hero-float-card shop-page__hero-float">
                <p className="hero-float-card__eyebrow">{t.common.brandName}</p>
                <p className="hero-float-card__title">
                  <em>{t.nav.tagline}</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="shop-page__hero-wave" aria-hidden>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 28C180 8 360 48 540 28S900 8 1080 28 1260 48 1440 28V56H0V28Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      <nav className="shop-page__nav" aria-label={s.collectionsHeading}>
        <div className="container">
          <div className="shop-page__nav-track">
            <div className="shop-page__nav-inner">
              <a href="#shop-all" className="shop-page__nav-link is-active">
                {s.filterAll}
              </a>
              {sections.map((section) => (
                <a
                  key={section.key}
                  href={`#shop-${section.key}`}
                  className="shop-page__nav-link"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="shop-page__nav-wave" aria-hidden>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 28C180 8 360 48 540 28S900 8 1080 28 1260 48 1440 28V56H0V28Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </nav>

      <div id="shop-all" className="shop-page__body">
        {sections.map((section) => (
          <section key={section.key} id={`shop-${section.key}`} className="shop-page__category">
            <div className="container">
              <header className="shop-page__category-head">
                <div className="shop-page__category-copy">
                  <p className="featured-products__eyebrow">
                    <span className="featured-products__eyebrow-line" aria-hidden />
                    {s.collectionsHeading}
                  </p>
                  <h2 className="shop-page__category-title">{section.label}</h2>
                  <p className="shop-page__category-count">{section.countLabel}</p>
                </div>
                <div className="shop-page__category-visual" aria-hidden>
                  <Image
                    src={CATEGORY_SECTION_IMAGES[section.key]}
                    alt=""
                    fill
                    sizes="200px"
                    className="shop-page__category-img"
                  />
                </div>
              </header>

              <div className="featured-products__grid">
                {section.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: String(product.id),
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      image: product.image,
                      href: product.handle ? `/shop/${product.handle}` : `/shop/product-${product.id}`,
                      badge: product.badge,
                      variantId: product.variantId,
                      availableForSale: product.availableForSale,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {shopifyStatus !== 'connected' ? (
        <aside className="shop-page__shopify" aria-labelledby="shopify-integration-title">
          <div className="container">
            <div className="shop-page__shopify-inner">
              <div>
                <p className="shop-page__shopify-eyebrow">{s.shopifyEyebrow}</p>
                <h2 id="shopify-integration-title" className="shop-page__shopify-title">
                  {shopifyStatus === 'auth_failed' ? s.shopifyAuthFailedTitle : s.shopifyTitle}
                </h2>
                <p className="shop-page__shopify-lead">
                  {shopifyStatus === 'auth_failed' ? s.shopifyAuthFailedLead : s.shopifyLead}
                </p>
              </div>
              <code className="shop-page__shopify-code">
                {shopifyStatus === 'auth_failed' ? s.shopifyAuthFailedHint : s.shopifyEnvHint}
              </code>
            </div>
          </div>
        </aside>
      ) : null}

      <section className="shop-page__foot">
        <div className="container shop-page__foot-inner">
          <Link href={lp('/')} className="btn btn-outline">
            {t.common.home}
          </Link>
        </div>
      </section>
    </div>
  );
}
