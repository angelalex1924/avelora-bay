'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NavSearchButton } from '@/app/components/navigation/nav-search-button';
import { NavCartDropdown } from '@/app/components/navigation/nav-cart-dropdown';
import { NavAuthDropdown } from '@/app/components/navigation/nav-auth-dropdown';
import { LanguageToggle } from '@/app/components/navigation/language-toggle';
import { NavMenuButton } from '@/app/components/navigation/nav-menu-button';
import { MobileNavOverlay } from '@/app/components/navigation/mobile-nav-overlay';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import {
  NAV_THEME_CROSSFADE,
  NAV_SHELL_BACKDROP,
  NAV_SHELL_DARK,
  NAV_SHELL_LIGHT,
  useNavScrolled,
  useNavSurfaceTheme,
} from '@/app/lib/nav-theme-motion';

export function MobileNavigation() {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const isLight = useNavSurfaceTheme('#mobile-sticky-nav', { heroFallback: true, initial: 'light' });
  const isScrolled = useNavScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);
  const showGlass = isScrolled || menuOpen;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] lg:hidden">
        <div
          className="pointer-events-auto px-4 pt-3 sm:px-5 sm:pt-4"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
        >
          <motion.div
            id="mobile-sticky-nav"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative isolate flex h-[52px] items-center justify-between gap-2 rounded-2xl px-2.5 sm:px-3"
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
              initial={false}
              animate={{ opacity: showGlass ? 1 : 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={NAV_SHELL_BACKDROP}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
              initial={false}
              animate={{ opacity: showGlass && !isLight ? 1 : 0 }}
              transition={NAV_THEME_CROSSFADE}
              style={NAV_SHELL_DARK}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
              initial={false}
              animate={{ opacity: showGlass && isLight ? 1 : 0 }}
              transition={NAV_THEME_CROSSFADE}
              style={NAV_SHELL_LIGHT}
            />

            <Link href={lp('/')} aria-label={t.common.brandName} className="flex shrink-0 items-center">
              <Image
                src="/avelora-bay.PNG"
                alt=""
                width={36}
                height={36}
                priority
                className="h-9 w-9 object-contain"
              />
            </Link>

            <div className="flex shrink-0 items-center gap-1">
              <NavSearchButton isLight={isLight} size="compact" />
              <NavCartDropdown isLight={isLight} size="compact" />
              <NavAuthDropdown isLight={isLight} size="compact" />
              <LanguageToggle isLight={isLight} size="compact" />
              <NavMenuButton
                open={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                tone={isLight ? 'dark' : 'hero'}
                size="sm"
              />
            </div>
          </motion.div>
        </div>
      </header>

      <MobileNavOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
