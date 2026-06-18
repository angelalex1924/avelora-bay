'use client';

import { Search } from 'lucide-react';
import { cn } from '@/app/lib/cn';

type NavSearchButtonProps = {
  isLight: boolean;
  size?: 'md' | 'compact';
  onClick?: () => void;
};

export function NavSearchButton({ isLight, size = 'md', onClick }: NavSearchButtonProps) {
  const compact = size === 'compact';

  return (
    <button
      type="button"
      aria-label="Search"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-xl border transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        compact ? 'h-9 w-9' : 'h-10 w-10',
        isLight
          ? 'border-[#2c2420]/12 text-[#2c2420]/85 hover:border-[#b8966e]/35 hover:bg-[#2c2420]/5 hover:text-[#2c2420]'
          : 'border-white/16 text-white/88 hover:border-white/28 hover:bg-white/12 hover:text-white',
      )}
    >
      <Search className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} strokeWidth={2} />
    </button>
  );
}
