import type { HeroPromo } from '@/app/components/hero-promo-carousel';

export const HERO_BRAND_NAME = 'Avelora Bay';
export const HERO_FLOAT_EYEBROW = 'Featured';

export const heroPromos: HeroPromo[] = [
  {
    id: 'coral-glow',
    badge: 'New',
    category: 'Skincare',
    productName: 'Coral Glow Serum',
    price: '€34',
    detail:
      'A lightweight marine-infused serum that restores radiance after sun exposure, with coral extract and sea minerals.',
    cta: 'Shop now',
    href: '/shop/coral-glow-serum',
    image: '/coral.png',
    accent: 'coral',
  },
  {
    id: 'ocean-mist',
    badge: '-20%',
    category: 'Fragrance',
    productName: 'Ocean Mist Eau de Parfum',
    price: '€58',
    detail:
      'Salt air, driftwood, and white florals — a breezy coastal scent inspired by morning walks along the shore.',
    cta: 'Discover',
    href: '/shop/ocean-mist',
    image: '/shell.png',
    accent: 'ocean',
  },
  {
    id: 'golden-sands',
    badge: 'Bestseller',
    category: 'Body Care',
    productName: 'Golden Sands Body Oil',
    price: '€42',
    detail:
      'Silky argan and coconut blend with a warm sand accord. Leaves skin luminous and softly scented all day.',
    cta: 'View product',
    href: '/shop/golden-sands-body-oil',
    image: '/palm.png',
    accent: 'sand',
  },
];
