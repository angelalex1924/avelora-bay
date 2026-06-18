import { cn } from '@/app/lib/cn';

type HeroPromoBadgeProps = {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
};

/** Gold plaque label — matches NavShopButton & Avelora coastal luxury tokens. */
export function HeroPromoBadge({ children, className, size = 'md' }: HeroPromoBadgeProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center overflow-hidden rounded-sm',
        'border border-[#b8966e]/45',
        'bg-gradient-to-br from-[#cdb08e] via-[#b8966e] to-[#9a7a58]',
        'font-sans font-semibold uppercase text-white',
        'shadow-[0_6px_18px_-8px_rgba(184,150,110,0.65),inset_0_1px_0_rgba(255,255,255,0.24)]',
        size === 'sm'
          ? 'px-2 py-0.5 text-[0.46rem] tracking-[0.2em]'
          : 'px-2.5 py-0.5 text-[0.52rem] tracking-[0.24em]',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-white/35"
      />
      <span className="relative ps-1">{children}</span>
    </span>
  );
}

type HeroPromoCategoryRowProps = {
  badge: string;
  category: string;
  className?: string;
  size?: 'sm' | 'md';
  align?: 'start' | 'center';
};

/** Editorial eyebrow row — gold plaque + line + category, like home hero-eyebrow. */
export function HeroPromoCategoryRow({
  badge,
  category,
  className,
  size = 'md',
  align = 'start',
}: HeroPromoCategoryRowProps) {
  return (
    <p
      className={cn(
        'mb-1.5 flex flex-wrap items-center gap-2 font-sans font-semibold uppercase text-[#b8966e]',
        size === 'sm' ? 'text-[0.58rem] tracking-[0.22em]' : 'text-[0.62rem] tracking-[0.24em]',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      <HeroPromoBadge size={size}>{badge}</HeroPromoBadge>
      <span className="inline-block h-px w-5 bg-[#b8966e]" aria-hidden />
      <span>{category}</span>
    </p>
  );
}
