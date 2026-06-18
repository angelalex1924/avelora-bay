'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { NavLogo, NAV_LOGO_INTRO_DELAY } from '@/app/components/navigation/nav-logo';
import {
  NavMegaMenuPanel,
  NavMegaMenuTriggers,
  NavDropdownShellDecor,
  useNavMegaMenu,
} from '@/app/components/navigation/nav-mega-menu';
import { LanguageToggle } from '@/app/components/navigation/language-toggle';
import { NavSearchButton } from '@/app/components/navigation/nav-search-button';
import { NavShopButton } from '@/app/components/navigation/nav-shop-button';
import { NavCartDropdown } from '@/app/components/navigation/nav-cart-dropdown';
import { NavAuthDropdown } from '@/app/components/navigation/nav-auth-dropdown';
import {
  NAV_THEME_CROSSFADE,
  NAV_SHELL_BACKDROP,
  NAV_SHELL_DARK,
  NAV_SHELL_LIGHT,
  useNavScrolled,
  useNavSurfaceTheme,
} from '@/app/lib/nav-theme-motion';
import { cn } from '@/app/lib/cn';
import { MobileNavigation } from '@/app/components/navigation/mobile-navigation';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

export function Navigation() {
  const { lp } = useLocalizedPath();
  const isLight = useNavSurfaceTheme('#desktop-sticky-nav', { heroFallback: true, initial: 'light' });
  const isScrolled = useNavScrolled(48);
  const [megaOpen, setMegaOpen] = useState(false);
  const { activeId, openMenu, scheduleClose, clearCloseTimer } = useNavMegaMenu(setMegaOpen);

  const navScrolled = isScrolled || megaOpen;
  const showNavGlass = navScrolled || megaOpen;
  const shellExpanded = megaOpen;

  return (
    <>
      <MobileNavigation />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] max-lg:hidden">
      <div className="pointer-events-auto px-4 pt-4 sm:px-5 sm:pt-5">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-[1400px]"
          onMouseLeave={() => {
            if (megaOpen) scheduleClose();
          }}
        >
          <div
            className={cn(
              'relative isolate overflow-hidden rounded-2xl transition-[box-shadow,backdrop-filter] duration-300',
              shellExpanded &&
                cn(
                  'backdrop-blur-xl',
                  isLight
                    ? 'shadow-[0_28px_70px_-24px_rgba(184,150,110,0.18)]'
                    : 'shadow-[0_28px_70px_-24px_rgba(44,36,32,0.45)]',
                ),
            )}
          >
            {shellExpanded ? <NavDropdownShellDecor lightMode={isLight} /> : null}

            <motion.div
              id="desktop-sticky-nav"
              className={cn(
                'relative flex h-[58px] items-center gap-2 px-2 sm:h-[62px] sm:gap-3 sm:px-3',
                shellExpanded ? 'z-[1]' : 'isolate rounded-2xl',
              )}
            >
              {!shellExpanded ? (
                <>
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
                    initial={false}
                    animate={{ opacity: showNavGlass ? 1 : 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    style={NAV_SHELL_BACKDROP}
                  />
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
                    initial={false}
                    animate={{ opacity: showNavGlass && !isLight ? 1 : 0 }}
                    transition={NAV_THEME_CROSSFADE}
                    style={NAV_SHELL_DARK}
                  />
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
                    initial={false}
                    animate={{ opacity: showNavGlass && isLight ? 1 : 0 }}
                    transition={NAV_THEME_CROSSFADE}
                    style={NAV_SHELL_LIGHT}
                  />
                </>
              ) : null}

              <div className="relative z-0 flex w-full items-center gap-2 sm:gap-3">
                <NavLogo isLight={isLight} href={lp('/')} />

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: NAV_LOGO_INTRO_DELAY + 0.1, duration: 0.8, ease: 'easeOut' }}
                  className="min-w-0 flex-1"
                >
                  <NavMegaMenuTriggers
                    lightMode={isLight}
                    menuOpen={megaOpen}
                    activeId={activeId}
                    openMenu={openMenu}
                    scheduleClose={scheduleClose}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    opacity: { delay: NAV_LOGO_INTRO_DELAY + 0.2, duration: 0.8, ease: 'easeOut' },
                    x: { delay: NAV_LOGO_INTRO_DELAY + 0.2, duration: 0.8, ease: 'easeOut' },
                  }}
                  className="ms-auto flex items-center gap-1.5 sm:gap-2"
                >
                  <NavSearchButton isLight={isLight} />

                  <LanguageToggle isLight={isLight} />

                  <NavShopButton isLight={isLight} />

                  <NavCartDropdown isLight={isLight} />

                  <NavAuthDropdown isLight={isLight} />
                </motion.div>
              </div>
            </motion.div>

            {activeId ? (
              <NavMegaMenuPanel
                unifiedShell
                lightMode={isLight}
                activeId={activeId}
                clearCloseTimer={clearCloseTimer}
                scheduleClose={scheduleClose}
              />
            ) : null}
          </div>
        </motion.div>
      </div>
      </header>
    </>
  );
}
