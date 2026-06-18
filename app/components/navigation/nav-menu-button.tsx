'use client';

import { motion } from 'motion/react';
import { cn } from '@/app/lib/cn';

export function NavMenuButton({
  open,
  onClick,
  tone = 'light',
  size = 'md',
  className,
}: {
  open: boolean;
  onClick: () => void;
  tone?: 'light' | 'dark' | 'hero';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const isDark = tone === 'dark';
  const isHero = tone === 'hero';
  const lineColor = isHero || !isDark ? '#ffffff' : '#2c2420';
  const btnSize = size === 'sm' ? 'h-8 w-8 rounded-full' : 'h-[38px] w-[38px] rounded-full';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? 'Close navigation' : 'Open navigation'}
      className={cn(
        'relative flex items-center justify-center transition-all duration-300',
        btnSize,
        className,
      )}
      style={{
        background: isHero
          ? open
            ? 'rgba(255,255,255,0.14)'
            : 'rgba(255,255,255,0.08)'
          : isDark
            ? open
              ? 'rgba(44,36,32,0.1)'
              : 'rgba(44,36,32,0.04)'
            : open
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(255,255,255,0.03)',
        boxShadow: isHero
          ? 'inset 0 1px 1px rgba(255,255,255,0.1)'
          : isDark
            ? 'inset 0 1px 1px rgba(255,255,255,0.5)'
            : 'inset 0 1px 1px rgba(255,255,255,0.12)',
      }}
    >
      <span
        className={cn(
          'absolute inset-0 rounded-full border',
          isHero ? 'border-white/14' : isDark ? 'border-[#2c2420]/10' : 'border-white/20',
        )}
      />

      <div className="relative h-[10px] w-[16px]">
        <motion.span
          className="absolute left-0 top-0 h-[1.5px] w-[16px] origin-center rounded-full"
          initial={false}
          animate={open ? { y: 4.25, rotate: 45 } : { y: 0, rotate: 0 }}
          style={{ backgroundColor: lineColor }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
        <motion.span
          className="absolute left-0 top-[4.25px] h-[1.5px] rounded-full"
          initial={false}
          animate={open ? { width: '16px', opacity: 0, x: 8 } : { width: '10px', opacity: 1, x: 0 }}
          style={{ backgroundColor: lineColor }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute bottom-0 left-0 h-[1.5px] w-[16px] origin-center rounded-full"
          initial={false}
          animate={open ? { y: -4.25, rotate: -45 } : { y: 0, rotate: 0 }}
          style={{ backgroundColor: lineColor }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
      </div>
    </motion.button>
  );
}
