import { useEffect, useRef, useState } from 'react';

export const NAV_THEME_CROSSFADE = {
  duration: 0.62,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const NAV_COMPACT_TRANSITION = NAV_THEME_CROSSFADE;

export const NAV_SHELL_BACKDROP = {
  backdropFilter: 'blur(36px) saturate(1.65)',
  WebkitBackdropFilter: 'blur(36px) saturate(1.65)',
} as const;

export const NAV_SHELL_DARK = {
  background: 'rgba(44, 36, 32, 0.88)',
  boxShadow:
    '0 24px 60px -16px rgba(44, 36, 32, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
} as const;

export const NAV_SHELL_LIGHT = {
  background: 'rgba(248, 244, 239, 0.92)',
  boxShadow:
    '0 12px 40px -8px rgba(184, 150, 110, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.65)',
} as const;

export type NavSurfaceTheme = 'light' | 'dark';

const NAV_INTERACTIVE_TAGS = new Set(['BUTTON', 'A']);

function extractFirstRGB(str: string): [number, number, number, number] | null {
  const m = str.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  return [+m[1], +m[2], +m[3], m[4] !== undefined ? parseFloat(m[4]) : 1];
}

function luminance(r: number, g: number, b: number) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function resolveNavThemeAtProbe(
  x: number,
  y: number,
  navSelector: string,
): NavSurfaceTheme | null {
  const els = document.elementsFromPoint(x, y);

  for (const el of els) {
    if (el.closest(navSelector)) continue;

    const themed = (el as HTMLElement).closest('[data-nav-theme]');
    if (themed) {
      const theme = themed.getAttribute('data-nav-theme');
      if (theme === 'dark' || theme === 'light') return theme;
    }
  }

  for (const el of els) {
    if (el.closest(navSelector)) continue;
    if (el.closest('[data-nav-theme-ignore]')) continue;
    if (NAV_INTERACTIVE_TAGS.has(el.tagName)) continue;
    if (el.tagName === 'IMG' || el.tagName === 'VIDEO') continue;

    const computed = window.getComputedStyle(el);
    const bgColor = computed.backgroundColor;
    const bgImage = computed.backgroundImage;

    let rgba: [number, number, number, number] | null = null;

    if (bgColor && bgColor !== 'transparent' && !bgColor.includes('rgba(0, 0, 0, 0)')) {
      rgba = extractFirstRGB(bgColor);
    }

    if (!rgba && bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
      rgba = extractFirstRGB(bgImage);
    }

    if (!rgba) continue;

    const [r, g, b, a] = rgba;
    if (a < 0.25) continue;

    const lum = luminance(r, g, b);
    if (lum > 0.65) return 'light';
    if (lum < 0.4) return 'dark';
  }

  return null;
}

function resolveNavThemeCandidate(
  navSelector: string,
  probeY: number,
  current: NavSurfaceTheme,
  heroFallback: boolean,
): NavSurfaceTheme {
  const probe = resolveNavThemeAtProbe(window.innerWidth / 2, probeY, navSelector);
  if (probe === 'light' || probe === 'dark') return probe;

  if (heroFallback) {
    const heroEl = document.querySelector('[data-nav-hero]');
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      const probeLine = probeY + 32;
      if (rect.top <= probeLine && rect.bottom > probeLine) return 'light';
    }
  }

  return current;
}

export function useNavSurfaceTheme(
  navSelector: string,
  options?: {
    probeY?: number;
    initial?: NavSurfaceTheme;
    heroFallback?: boolean;
    stableFrames?: number;
  },
): boolean {
  const probeY = options?.probeY ?? 40;
  const heroFallback = options?.heroFallback ?? false;
  const stableFrames = options?.stableFrames ?? 3;
  const initial = options?.initial ?? 'light';

  const [isLight, setIsLight] = useState(initial === 'light');
  const themeRef = useRef<NavSurfaceTheme>(initial);
  const pendingRef = useRef<NavSurfaceTheme | null>(null);
  const pendingCountRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const commitTheme = (next: NavSurfaceTheme) => {
      if (next === themeRef.current) {
        pendingRef.current = null;
        pendingCountRef.current = 0;
        return;
      }

      if (pendingRef.current === next) {
        pendingCountRef.current += 1;
      } else {
        pendingRef.current = next;
        pendingCountRef.current = 1;
      }

      if (pendingCountRef.current < stableFrames) return;

      themeRef.current = next;
      setIsLight(next === 'light');
      pendingRef.current = null;
      pendingCountRef.current = 0;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          commitTheme(
            resolveNavThemeCandidate(navSelector, probeY, themeRef.current, heroFallback),
          );
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [navSelector, probeY, heroFallback, stableFrames]);

  return isLight;
}

export function useNavScrolled(threshold = 48): boolean {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const next = window.scrollY > threshold;
          if (next !== scrolledRef.current) {
            scrolledRef.current = next;
            setIsScrolled(next);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isScrolled;
}
