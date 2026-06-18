'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AcronWebIcon, AcronWebWordmark } from '@/app/components/acron-web-brand';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

const shopHrefs = [
  '/shop/new-arrivals',
  '/shop/home-decor',
  '/shop/jewellery',
  '/shop/candles-scents',
  '/shop/textiles',
  '/shop/gift-sets',
];

const infoHrefs = [
  '/about-us',
  '/our-story',
  '/sustainability',
  '/shipping-returns',
  '/privacy-policy',
  '/terms-conditions',
];

const socialLinks = [
  { id: 'footer-instagram', label: 'Instagram', href: 'https://instagram.com' },
  { id: 'footer-facebook', label: 'Facebook', href: 'https://facebook.com' },
  { id: 'footer-pinterest', label: 'Pinterest', href: 'https://pinterest.com' },
  { id: 'footer-tiktok', label: 'TikTok', href: 'https://tiktok.com' },
] as const;

export default function Footer() {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <section className="site-footer__hero" aria-label={t.footer.stayConnected}>
        <Image
          src="/hero-back.jpg"
          alt=""
          fill
          sizes="100vw"
          className="site-footer__hero-img"
        />
        <div className="site-footer__hero-shade" aria-hidden />

        <div className="container site-footer__hero-inner">
          <p className="site-footer__eyebrow">{t.home.joinCommunity}</p>
          <h2 className="site-footer__hero-title">{t.home.newsletterTitle}</h2>
          <p className="site-footer__hero-lead">{t.footer.newsletterLead}</p>

          <form
            id="newsletter-form"
            className="site-footer__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              {t.common.emailPlaceholder}
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder={t.common.emailPlaceholder}
              className="site-footer__input"
              autoComplete="email"
            />
            <button id="newsletter-submit" type="submit" className="site-footer__submit">
              <span>{t.common.subscribe}</span>
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
            </button>
          </form>
        </div>
      </section>

      <div className="site-footer__dark">
        <div className="site-footer__ambient" aria-hidden />

        <div className="site-footer__deco" aria-hidden>
          <Image
            src="/palm-leaf.png"
            alt=""
            width={58}
            height={74}
            className="site-footer__deco-img site-footer__deco-img--palmlf"
          />
          <Image
            src="/leaf.png"
            alt=""
            width={42}
            height={54}
            className="site-footer__deco-img site-footer__deco-img--leaf"
          />
          <Image
            src="/sea-star.png"
            alt=""
            width={32}
            height={32}
            className="site-footer__deco-img site-footer__deco-img--star"
          />
          <Image
            src="/coral.png"
            alt=""
            width={44}
            height={50}
            className="site-footer__deco-img site-footer__deco-img--coral"
          />
          <Image
            src="/shell-weird.png"
            alt=""
            width={28}
            height={36}
            className="site-footer__deco-img site-footer__deco-img--shell"
          />
        </div>

        <div className="container site-footer__body">
          <div className="site-footer__brand-block">
            <Link href={lp('/')} className="site-footer__brand">
              <Image
                src="/avelora-bay.PNG"
                alt=""
                width={40}
                height={40}
                aria-hidden
                className="site-footer__brand-icon"
              />
              <Image
                src="/avelora-bay-text.PNG"
                alt={t.common.brandName}
                width={168}
                height={30}
                className="site-footer__brand-wordmark"
              />
            </Link>
            <p className="site-footer__manifesto">
              <em>{t.footer.tagline}</em>
            </p>
            <p className="site-footer__description">{t.footer.description}</p>
          </div>

          <div className="site-footer__panels">
            <div className="site-footer__panel">
              <div className="site-footer__panel-head">
                <h3 className="site-footer__panel-label">{t.footer.shop}</h3>
                <Link href={lp('/shop')} className="site-footer__panel-all">
                  {t.nav.shop}
                  <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
                </Link>
              </div>
              <nav className="site-footer__link-grid" aria-label={t.footer.shop}>
                {t.footer.shopLinks.map((item, i) => (
                  <Link key={item} href={lp(shopHrefs[i])} className="site-footer__grid-link">
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="site-footer__panel">
              <div className="site-footer__panel-head">
                <h3 className="site-footer__panel-label">{t.footer.information}</h3>
              </div>
              <nav className="site-footer__link-grid" aria-label={t.footer.information}>
                {t.footer.infoLinks.map((item, i) => (
                  <Link key={item} href={lp(infoHrefs[i])} className="site-footer__grid-link">
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="site-footer__social" aria-label="Social media">
            {socialLinks.map((item, index) => (
              <span key={item.id} className="site-footer__social-item">
                {index > 0 ? (
                  <span className="site-footer__social-sep" aria-hidden>
                    ·
                  </span>
                ) : null}
                <a
                  id={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__social-link"
                >
                  {item.label}
                </a>
              </span>
            ))}
          </div>

          <div className="site-footer__bar">
            <p className="site-footer__copyright">
              © {year} {t.common.brandName}. {t.common.allRights}
            </p>
            <nav className="site-footer__legal" aria-label="Legal">
              <Link href={lp('/privacy-policy')} className="site-footer__legal-link">
                {t.footer.infoLinks[4]}
              </Link>
              <Link href={lp('/terms-conditions')} className="site-footer__legal-link">
                {t.footer.infoLinks[5]}
              </Link>
              <Link href={lp('/shipping-returns')} className="site-footer__legal-link">
                {t.footer.infoLinks[3]}
              </Link>
            </nav>
          </div>

          <div className="site-footer__credit">
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
                gradientId="awg-footer-credit"
                tone="avelora"
              />
              <AcronWebWordmark
                tone="avelora"
                compact
                className="site-footer__credit-wordmark"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
