'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/app/lib/cn';
import { HeroPromoCategoryRow } from '@/app/components/hero-promo-badge';
import type { HeroPromo } from '@/app/components/hero-promo-carousel';
import './hero-promo-waves.css';

const WAVE_PATH =
  'M0 28C180 8 360 48 540 28S900 8 1080 28 1260 48 1440 28V56H0Z';

const ACCENT_BG: Record<HeroPromo['accent'], string> = {
  ocean:
    'bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(168,198,218,0.45)_0%,transparent_58%),linear-gradient(165deg,#f5f0ea_0%,#e8eef3_42%,#f0ebe4_100%)]',
  sand:
    'bg-[radial-gradient(ellipse_80%_60%_at_80%_20%,rgba(212,175,120,0.28)_0%,transparent_55%),linear-gradient(155deg,#faf6f0_0%,#f3ebe0_48%,#efe6d8_100%)]',
  coral:
    'bg-[radial-gradient(ellipse_75%_65%_at_20%_15%,rgba(224,160,140,0.32)_0%,transparent_52%),linear-gradient(160deg,#faf4f1_0%,#f5e8e4_45%,#f0ebe6_100%)]',
};

type HeroPromoSlideCardProps = {
  promo: HeroPromo;
  index: number;
  brandName: string;
  floatEyebrow: string;
  isMobile: boolean;
  hideBrand?: boolean;
  lp: (href: string) => string;
};

function padSlide(index: number) {
  return String(index + 1).padStart(2, '0');
}

function WaveDivider() {
  return (
    <div className="pointer-events-none relative -mt-px h-4 w-full overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="hero-promo-wave-band absolute left-0 top-0 h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="rgba(255,255,255,0.82)" d={WAVE_PATH} />
      </svg>
    </div>
  );
}

export function HeroPromoSlideCard({
  promo,
  index,
  brandName,
  floatEyebrow,
  isMobile,
  hideBrand = false,
  lp,
}: HeroPromoSlideCardProps) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden rounded-[1.65rem] border border-white/70 md:rounded-[2rem]',
        isMobile
          ? 'shadow-none'
          : 'shadow-[0_32px_72px_-36px_rgba(44,36,32,0.58),0_0_0_1px_rgba(184,150,110,0.1),inset_0_1px_0_rgba(255,255,255,0.65)]',
        ACCENT_BG[promo.accent],
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5)_0%,transparent_55%)]" />

      <div
        className={cn(
          'relative z-[1] flex h-full flex-col',
          isMobile ? 'px-3 pb-0 pt-2.5' : 'px-5 pb-6 pt-4',
        )}
      >
        <header className={cn('mb-1.5 flex flex-col items-center gap-1', (!isMobile || hideBrand) && 'hidden')}>
          <Image
            src="/avelora-bay.PNG"
            alt=""
            width={36}
            height={36}
            priority={index === 0}
            className="h-8 w-8 object-contain"
            draggable={false}
          />
          <Image
            src="/avelora-bay-text.PNG"
            alt={brandName}
            width={140}
            height={26}
            priority={index === 0}
            className="h-6 w-auto max-w-[9.5rem] object-contain mix-blend-multiply"
            draggable={false}
          />
        </header>

        <div className={cn('flex flex-1 flex-col', isMobile ? 'gap-0' : 'gap-8 md:flex-row md:items-center')}>
          <div
            className={cn(
              'relative mx-auto w-full',
              isMobile ? 'max-w-[240px] shrink-0 pb-1' : 'mx-0 min-h-[300px] flex-[0_0_52%]',
            )}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(184,150,110,0.2)]" />
            <div
              className={cn(
                'relative mx-auto w-full overflow-hidden',
                isMobile
                  ? 'aspect-[4/5] max-h-[210px] rounded-[52%_48%_50%_50%/44%_44%_56%_56%]'
                  : 'aspect-[4/5] max-w-[340px] rounded-[58%_42%_52%_48%/42%_42%_58%_58%] shadow-[0_20px_50px_-20px_rgba(44,36,32,0.45)]',
              )}
            >
              <Image
                src={promo.image}
                alt={promo.productName}
                fill
                priority={index === 0}
                sizes="(max-width: 900px) 72vw, 420px"
                className="object-cover"
                draggable={false}
              />
            </div>

            <div
              className={cn(
                'absolute z-[3] rounded-xl border border-white/60 bg-white/85 shadow-lg backdrop-blur-md',
                isMobile
                  ? 'bottom-[4%] left-[2%] min-w-[118px] px-2.5 py-2'
                  : '-left-[4%] bottom-[10%] min-w-[168px] px-5 py-4',
              )}
            >
              <span className="block text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-[#b8966e] md:text-[0.55rem] md:tracking-[0.2em]">
                {floatEyebrow}
              </span>
              <span className="mt-0.5 block font-serif text-xs font-normal text-[#2c2420] md:text-base">{promo.productName}</span>
              <span className="mt-0.5 block text-xs font-semibold text-[#b8966e] md:text-sm">{promo.price}</span>
            </div>

          </div>

          <div
            className={cn(
              'relative flex flex-col',
              isMobile
                ? '-mx-3 mt-0 text-center'
                : 'flex-1 py-2 text-center md:items-start md:text-left',
            )}
          >
            {isMobile && <WaveDivider />}

            <div
              className={cn(
                isMobile &&
                  'rounded-b-[1.15rem] bg-white/80 px-3.5 pb-3.5 pt-2 backdrop-blur-sm',
              )}
            >
              {!isMobile && (
                <span className="pointer-events-none absolute -top-2 right-0 select-none font-serif text-7xl text-[rgba(184,150,110,0.14)]">
                  {padSlide(index)}
                </span>
              )}

              <HeroPromoCategoryRow
                badge={promo.badge}
                category={promo.category}
                size={isMobile ? 'sm' : 'md'}
                align={isMobile ? 'center' : 'start'}
              />

              <h2
                className={cn(
                  'font-serif font-normal leading-tight text-[#2c2420]',
                  isMobile ? 'text-xl' : 'max-w-[14ch] text-[clamp(1.85rem,2.6vw,2.45rem)]',
                )}
              >
                {promo.productName}
              </h2>
              <p
                className={cn(
                  'mt-1.5 font-light leading-relaxed text-[#8a6f5a]',
                  isMobile ? 'text-xs line-clamp-2' : 'mt-2 max-w-[32ch] text-[0.82rem]',
                )}
              >
                {promo.detail}
              </p>

              <div className={cn('mt-2 flex items-center gap-3', isMobile ? 'justify-center' : 'mt-3 justify-start')}>
                <span className={cn('font-serif text-[#b8966e]', isMobile ? 'text-xl' : 'text-[1.85rem]')}>{promo.price}</span>
                <span className="flex items-center gap-1 text-[0.65rem] text-[#8a6f5a] md:text-xs">
                  <span className="tracking-wider text-[#b8966e]">★★★★★</span>
                  <span className="font-semibold">4.9</span>
                </span>
              </div>

              <Link
                href={lp(promo.href)}
                draggable={false}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-md bg-[#2c2420] font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-px',
                  isMobile
                    ? 'mt-2.5 w-full px-4 py-2.5 text-[0.58rem]'
                    : 'mt-4 w-auto self-start px-7 py-3.5 text-[0.62rem] md:self-start',
                )}
              >
                <span>{promo.cta}</span>
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
