'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/app/lib/cn';
import { HeroPromoCategoryRow } from '@/app/components/hero-promo-badge';
import type { HeroPromo } from '@/app/components/hero-promo-carousel';
import '@/app/styles/hero-promo-desktop.css';

const ACCENT: Record<
  HeroPromo['accent'],
  { panel: string; chip: string; glow: string; tint: string }
> = {
  ocean: {
    panel: 'from-[#f4f8fa]/95 via-white/90 to-[#eef4f7]/95',
    chip: 'bg-[#e4eef2]/90 text-[#5a7a82] border-[#a8c6da]/30',
    glow: 'rgba(168,198,218,0.35)',
    tint: 'from-[#2c2420]/25 via-[#2c2420]/5 to-transparent',
  },
  sand: {
    panel: 'from-[#faf7f2]/95 via-white/92 to-[#f5efe6]/95',
    chip: 'bg-[#f3ebe0]/90 text-[#8a6f5a] border-[#d4af78]/30',
    glow: 'rgba(212,175,120,0.32)',
    tint: 'from-[#2c2420]/28 via-[#2c2420]/6 to-transparent',
  },
  coral: {
    panel: 'from-[#faf5f3]/95 via-white/92 to-[#f8eeea]/95',
    chip: 'bg-[#fae8e2]/85 text-[#9a6b5c] border-[#e0a08c]/30',
    glow: 'rgba(224,160,140,0.28)',
    tint: 'from-[#2c2420]/26 via-[#2c2420]/5 to-transparent',
  },
};

function padSlide(index: number) {
  return String(index + 1).padStart(2, '0');
}

type HeroPromoDesktopCardProps = {
  promo: HeroPromo;
  index: number;
  floatEyebrow: string;
  lp: (href: string) => string;
};

export function HeroPromoDesktopCard({ promo, index, floatEyebrow, lp }: HeroPromoDesktopCardProps) {
  const accent = ACCENT[promo.accent];

  return (
    <article className="hero-promo-desktop-card group relative h-full min-h-[min(480px,54vh)] w-full overflow-hidden rounded-[1.85rem] border border-white/70 bg-white shadow-[0_32px_72px_-36px_rgba(44,36,32,0.55),0_0_0_1px_rgba(184,150,110,0.12)]">
      <div className="grid h-full min-h-[inherit] grid-cols-1 md:grid-cols-[1.08fr_0.92fr]">
        {/* Image stage — full bleed left */}
        <div className="relative min-h-[220px] overflow-hidden md:min-h-0">
          <div
            className="pointer-events-none absolute -inset-4 z-[1] opacity-60 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
            style={{ background: `radial-gradient(circle at 40% 50%, ${accent.glow} 0%, transparent 65%)` }}
            aria-hidden
          />

          <Image
            src={promo.image}
            alt={promo.productName}
            fill
            priority={index === 0}
            sizes="(max-width: 1200px) 42vw, 480px"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            draggable={false}
          />

          <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r', accent.tint)} />

          {/* Floating price chip */}
          <div className="absolute bottom-5 left-5 z-[2] overflow-hidden rounded-2xl border border-white/60 bg-white/88 px-4 py-3 shadow-[0_16px_40px_-20px_rgba(44,36,32,0.5)] backdrop-blur-md md:bottom-6 md:left-6">
            <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#cdb08e] to-[#b8966e]" aria-hidden />
            <span className="block ps-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.22em] text-[#b8966e]">
              {floatEyebrow}
            </span>
            <span className="mt-1 block ps-1.5 font-serif text-[1.1rem] leading-none text-[#2c2420]">{promo.price}</span>
          </div>
        </div>

        {/* Copy panel */}
        <div
          className={cn(
            'relative flex flex-col justify-center bg-gradient-to-br px-6 py-8 backdrop-blur-xl md:px-8 md:py-10 lg:px-10',
            accent.panel,
          )}
        >
          <span
            className="pointer-events-none absolute right-4 top-2 select-none font-serif text-[4.5rem] leading-none text-[#b8966e]/[0.07] lg:text-[5.5rem]"
            aria-hidden
          >
            {padSlide(index)}
          </span>

          <div className="relative">
            <HeroPromoCategoryRow badge={promo.badge} category={promo.category} />

            <h2 className="max-w-[14ch] font-serif text-[clamp(1.65rem,2.2vw,2.2rem)] font-normal leading-[1.1] tracking-[-0.01em] text-[#2c2420]">
              {promo.productName}
            </h2>

            <p className="mt-3 max-w-[32ch] text-[0.84rem] font-light leading-[1.72] text-[#8a6f5a]">
              {promo.detail}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="font-serif text-[1.85rem] leading-none text-[#b8966e]">{promo.price}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8966e]/18 bg-white/55 px-2.5 py-1 text-[0.68rem] text-[#8a6f5a]">
                <span className="tracking-wider text-[#b8966e]">★★★★★</span>
                <span className="font-semibold text-[#2c2420]">4.9</span>
              </span>
            </div>

            <Link
              href={lp(promo.href)}
              draggable={false}
              className="group/btn relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-[#2c2420]/10 bg-[#2c2420] px-6 py-3.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_36px_-18px_rgba(44,36,32,0.6)] transition hover:-translate-y-0.5 hover:border-[#b8966e]/35 hover:shadow-[0_18px_44px_-16px_rgba(184,150,110,0.4)]"
            >
              <span
                className="hero-promo-desktop-card__cta-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                aria-hidden
              />
              <span className="relative">{promo.cta}</span>
              <ArrowUpRight
                className="relative h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
