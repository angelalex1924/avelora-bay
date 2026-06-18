'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/app/lib/cn';
import { HeroPromoBadge } from '@/app/components/hero-promo-badge';
import type { HeroPromo } from '@/app/components/hero-promo-carousel';

type MobileNavPromoStripProps = {
  promos: readonly HeroPromo[];
  floatEyebrow: string;
  lp: (href: string) => string;
};

const AUTOPLAY_MS = 5500;

function padSlide(index: number) {
  return String(index + 1).padStart(2, '0');
}

export function MobileNavPromoStrip({ promos, floatEyebrow, lp }: MobileNavPromoStripProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', duration: 28 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const total = promos.length;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || total <= 1) return;
    const timer = window.setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [emblaApi, total]);

  if (total === 0) return null;

  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)]">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {promos.map((promo) => (
            <div key={promo.id} className="min-w-0 shrink-0 grow-0 basis-full">
              <Link
                href={lp(promo.href)}
                className="relative block min-h-[188px] overflow-hidden"
              >
                <Image
                  src={promo.image}
                  alt={promo.productName}
                  fill
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="object-cover"
                  priority={promo.id === promos[0]?.id}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(105deg, rgba(44,36,32,0.82) 0%, rgba(44,36,32,0.35) 46%, rgba(44,36,32,0.2) 100%)',
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(44,36,32,0.12) 0%, rgba(44,36,32,0.55) 58%, rgba(44,36,32,0.96) 100%)',
                  }}
                  aria-hidden
                />

                <div
                  className="relative z-10 flex min-h-[188px] flex-col justify-end px-4 pb-10 pt-4"
                  style={{ textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <HeroPromoBadge size="sm">{promo.badge}</HeroPromoBadge>
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/45">
                      {floatEyebrow}
                    </span>
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#cdb08e]">
                    {promo.category}
                  </p>
                  <h3 className="mt-1 font-serif text-[1.35rem] font-normal leading-tight text-white">
                    {promo.productName}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[12px] font-light leading-relaxed text-white/72">
                    {promo.detail}
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <span className="font-serif text-2xl text-[#e8d4bc]">{promo.price}</span>
                      <span className="ms-2 text-[10px] font-medium text-white/45">★★★★★ 4.9</span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/92 backdrop-blur-sm">
                      {promo.cta}
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 pb-2 pt-1">
        <div
          className="flex items-baseline gap-1 font-sans text-[0.62rem] font-medium tracking-[0.14em] text-white/45"
          aria-live="polite"
        >
          <span className="font-serif text-[1.05rem] font-normal text-white/90">{padSlide(selectedIndex)}</span>
          <span>/</span>
          <span>{String(total).padStart(2, '0')}</span>
        </div>

        <div className="flex items-center gap-2.5" role="tablist" aria-label="Promotions">
          {promos.map((promo, i) => (
            <button
              key={promo.id}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Slide ${i + 1} of ${total}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'pointer-events-auto rounded-full transition-all duration-300',
                i === selectedIndex ? 'h-[5px] w-[26px] bg-[#cdb08e]' : 'h-[7px] w-[7px] bg-white/35',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
