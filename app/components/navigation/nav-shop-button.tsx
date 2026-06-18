'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/app/lib/cn';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

type NavShopButtonProps = {
  isLight: boolean;
};

export function NavShopButton({ isLight }: NavShopButtonProps) {
  const t = useTranslations();
  const { lp } = useLocalizedPath();

  return (
    <Link
      href={lp('/shop')}
      className={cn(
        'group relative hidden items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-[13px] font-semibold tracking-[0.02em] transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:inline-flex',
        'border border-[#b8966e]/45',
        'bg-gradient-to-br from-[#cdb08e] via-[#b8966e] to-[#9a7a58]',
        'text-white shadow-[0_10px_28px_-10px_rgba(184,150,110,0.65),inset_0_1px_0_rgba(255,255,255,0.22)]',
        'hover:-translate-y-px hover:border-[#cdb08e]/55 hover:shadow-[0_14px_32px_-10px_rgba(184,150,110,0.75)]',
        'active:translate-y-0 active:scale-[0.98]',
        !isLight && 'shadow-[0_10px_28px_-10px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18)]',
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <ShoppingBag className="relative h-4 w-4" strokeWidth={2} aria-hidden />
      <span className="relative">{t.nav.shop}</span>
    </Link>
  );
}
