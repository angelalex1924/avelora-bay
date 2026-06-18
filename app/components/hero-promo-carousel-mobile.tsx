'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/app/lib/cn';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import { HeroPromoSlideCard } from '@/app/components/hero-promo-slide-card';
import type { HeroPromo } from '@/app/components/hero-promo-carousel';

const AUTOPLAY_MS = 5500;

type SlideTiming = {
  startedAt: number;
  pausedTotal: number;
  pauseStartedAt: number | null;
};

function getElapsedMs(timing: SlideTiming) {
  const now = Date.now();
  const activePause = timing.pauseStartedAt != null ? now - timing.pauseStartedAt : 0;
  return Math.max(0, now - timing.startedAt - timing.pausedTotal - activePause);
}

function getRemainingMs(timing: SlideTiming) {
  return Math.max(0, AUTOPLAY_MS - getElapsedMs(timing));
}

function padSlide(index: number) {
  return String(index + 1).padStart(2, '0');
}

type HeroPromoCarouselMobileProps = {
  promos: readonly HeroPromo[];
  brandName: string;
  floatEyebrow: string;
  onSlideChange?: (index: number) => void;
  compact?: boolean;
};

function PromoSlideDot({
  active,
  progress,
  label,
  onClick,
}: {
  active: boolean;
  progress: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className="relative z-50 flex h-6 min-w-0 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 px-0.5 touch-manipulation [-webkit-tap-highlight-color:transparent]"
    >
      {active ? (
        <span className="relative block h-[5px] w-[26px] overflow-hidden rounded-full bg-[rgba(184,150,110,0.22)]">
          <span
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-[#b8966e] to-[#cdb08e]"
            style={{ transform: `scaleX(${progress})` }}
          />
        </span>
      ) : (
        <span className="block h-[7px] w-[7px] rounded-full bg-[rgba(184,150,110,0.35)]" />
      )}
    </button>
  );
}

export function HeroPromoCarouselMobile({
  promos,
  brandName,
  floatEyebrow,
  onSlideChange,
  compact = false,
}: HeroPromoCarouselMobileProps) {
  const { lp } = useLocalizedPath();
  const slides = promos;
  const total = slides.length;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);
  const [carouselInView, setCarouselInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const pausedRef = useRef(false);
  const dragPausedRef = useRef(false);
  const slideTimingRef = useRef<SlideTiming>({
    startedAt: Date.now(),
    pausedTotal: 0,
    pauseStartedAt: null,
  });
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const onSlideChangeRef = useRef(onSlideChange);

  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  const emblaOptions = useMemo(
    () => ({
      loop: false,
      align: 'start' as const,
      containScroll: 'trimSnaps' as const,
      direction: 'ltr' as const,
      duration: 55,
      skipSnaps: false,
      dragFree: false,
      watchSlides: true,
    }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const resetSlideTiming = useCallback(() => {
    slideTimingRef.current = {
      startedAt: Date.now(),
      pausedTotal: 0,
      pauseStartedAt: null,
    };
    setFillProgress(0);
  }, []);

  const scheduleAutoplay = useCallback(() => {
    clearAutoplayTimer();
    if (
      !emblaApi ||
      pausedRef.current ||
      !carouselInView ||
      !pageVisible ||
      document.hidden ||
      emblaApi.scrollSnapList().length <= 1
    ) {
      return;
    }

    const remaining = getRemainingMs(slideTimingRef.current);
    autoplayTimerRef.current = setTimeout(() => {
      if (pausedRef.current || document.hidden) return;
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, remaining);
  }, [clearAutoplayTimer, emblaApi, carouselInView, pageVisible]);

  const syncClock = useCallback(() => {
    const shouldRun =
      pageVisible && carouselInView && !document.hidden && !dragPausedRef.current;
    const timing = slideTimingRef.current;

    if (shouldRun) {
      if (timing.pauseStartedAt !== null) {
        timing.pausedTotal += Date.now() - timing.pauseStartedAt;
        timing.pauseStartedAt = null;
      }
      pausedRef.current = false;
      scheduleAutoplay();
      return;
    }

    if (timing.pauseStartedAt === null) {
      timing.pauseStartedAt = Date.now();
    }
    pausedRef.current = true;
    clearAutoplayTimer();
  }, [pageVisible, carouselInView, scheduleAutoplay, clearAutoplayTimer]);

  const onEmblaSelect = useCallback(() => {
    if (!emblaApi) return;
    const rawIdx = emblaApi.selectedScrollSnap();
    const idx = slides[rawIdx] ? rawIdx : 0;
    setSelectedIndex(idx);
    dragPausedRef.current = false;
    resetSlideTiming();
    onSlideChangeRef.current?.(idx);
    syncClock();
  }, [emblaApi, slides, resetSlideTiming, syncClock]);

  const onPointerDown = useCallback(() => {
    dragPausedRef.current = true;
    syncClock();
  }, [syncClock]);

  const onPointerUp = useCallback(() => {
    dragPausedRef.current = false;
    syncClock();
  }, [syncClock]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit(emblaOptions);
  }, [emblaApi, slides, emblaOptions]);

  useEffect(() => {
    if (!emblaApi) return;
    onEmblaSelect();
    emblaApi.on('select', onEmblaSelect);
    emblaApi.on('reInit', onEmblaSelect);
    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerUp);
    emblaApi.on('settle', onPointerUp);

    return () => {
      emblaApi.off('select', onEmblaSelect);
      emblaApi.off('reInit', onEmblaSelect);
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('pointerUp', onPointerUp);
      emblaApi.off('settle', onPointerUp);
    };
  }, [emblaApi, onEmblaSelect, onPointerDown, onPointerUp]);

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
    });
  }, [slides]);

  useEffect(() => {
    const onVis = () => setPageVisible(!document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCarouselInView(entry.isIntersecting),
      { threshold: 0.08, rootMargin: '40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      const elapsed = getElapsedMs(slideTimingRef.current);
      setFillProgress(Math.min(1, elapsed / AUTOPLAY_MS));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    syncClock();
  }, [emblaApi, syncClock]);

  useEffect(() => {
    syncClock();
  }, [pageVisible, carouselInView, syncClock]);

  useEffect(
    () => () => {
      clearAutoplayTimer();
    },
    [clearAutoplayTimer],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  if (total === 0) return null;

  return (
    <div ref={rootRef} className="relative isolate z-20 w-full">
      <div
        ref={emblaRef}
        dir="ltr"
        className="overflow-hidden [unicode-bidi:isolate]"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y pinch-zoom',
        }}
      >
        <div className="flex items-stretch">
          {slides.map((promo, slideIndex) => (
            <div key={promo.id} className="flex min-w-0 shrink-0 grow-0 basis-full">
              <div
                className={cn(
                  'relative flex-1 overflow-hidden',
                  compact ? 'min-h-[200px]' : 'min-h-[clamp(280px,44vh,380px)]',
                )}
              >
                <HeroPromoSlideCard
                  promo={promo}
                  index={slideIndex}
                  brandName={brandName}
                  floatEyebrow={floatEyebrow}
                  isMobile
                  hideBrand={compact}
                  lp={lp}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-50 mt-4 flex items-center justify-center px-0.5 pointer-events-auto">
        <div
          className="absolute left-0.5 flex items-baseline gap-1.5 font-sans text-[0.62rem] font-medium tracking-[0.16em] text-[#8a6f5a]"
          aria-live="polite"
        >
          <span className="font-serif text-[1.15rem] font-normal text-[#2c2420]">
            {padSlide(selectedIndex)}
          </span>
          <span className="opacity-40">/</span>
          <span className="opacity-70">{String(total).padStart(2, '0')}</span>
        </div>

        <div className="flex items-center gap-0 -space-x-px" role="tablist" aria-label="Promotions">
          {slides.map((promo, i) => (
            <PromoSlideDot
              key={promo.id}
              active={i === selectedIndex}
              progress={i === selectedIndex ? fillProgress : 0}
              label={`Slide ${i + 1} of ${total}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
