'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/app/lib/cn';
import { NAV_THEME_CROSSFADE } from '@/app/lib/nav-theme-motion';

const NAV_LOGO_INTRO_DELAY = 0.08;

type NavLogoProps = {
  isLight: boolean;
  href?: string;
};

export { NAV_LOGO_INTRO_DELAY };

export function NavLogo({ isLight, href = '/' }: NavLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: NAV_LOGO_INTRO_DELAY, duration: 0.2 }}
    >
      <Link
        href={href}
        className={cn(
          'flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-2.5 sm:px-3',
          isLight ? 'hover:bg-[#2c2420]/5' : 'hover:bg-white/10',
        )}
      >
        <Image
          src="/avelora-bay.PNG"
          alt=""
          width={36}
          height={36}
          priority
          className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
        />
        <motion.span
          initial={false}
          animate={{ opacity: 1 }}
          transition={NAV_THEME_CROSSFADE}
          className="relative block"
        >
          <Image
            src="/avelora-bay-text.PNG"
            alt="Avelora Bay"
            width={148}
            height={28}
            priority
            className="h-6 w-auto max-w-[9.5rem] object-contain sm:h-7 sm:max-w-[10.5rem]"
          />
        </motion.span>
      </Link>
    </motion.div>
  );
}
