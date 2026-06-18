'use client';

import { useSyncExternalStore } from 'react';
import { HeroPromoCarouselDesktop } from '@/app/components/hero-promo-carousel-desktop';
import { HeroPromoCarouselMobile } from '@/app/components/hero-promo-carousel-mobile';

export type HeroPromoAccent = 'ocean' | 'sand' | 'coral';

export type HeroPromo = {
  id: string;
  badge: string;
  category: string;
  productName: string;
  price: string;
  detail: string;
  cta: string;
  href: string;
  image: string;
  accent: HeroPromoAccent | string;
};

type HeroPromoCarouselProps = {
  promos: readonly HeroPromo[];
  brandName: string;
  floatEyebrow: string;
  onSlideChange?: (index: number) => void;
  /** Shorter slides for embedded contexts (e.g. mobile nav overlay) */
  compact?: boolean;
};

const MOBILE_MQ = '(max-width: 900px)';

function subscribeMobileMq(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_MQ);
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function getMobileServerSnapshot() {
  return false;
}

export function HeroPromoCarousel(props: HeroPromoCarouselProps) {
  const isMobile = useSyncExternalStore(subscribeMobileMq, getMobileSnapshot, getMobileServerSnapshot);

  if (props.compact || isMobile) {
    return <HeroPromoCarouselMobile {...props} />;
  }

  return <HeroPromoCarouselDesktop promos={props.promos} brandName={props.brandName} floatEyebrow={props.floatEyebrow} />;
}
