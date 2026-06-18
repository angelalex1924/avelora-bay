'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { aveloraBrand, aveloraNavGradient } from '@/app/lib/avelora-brand';
import { getNavMegaMenu, type NavMegaItem, type NavMegaSpotlight } from '@/app/lib/nav-mega-menu';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import { NavContactCards } from '@/app/components/navigation/nav-contact-cards';
import { cn } from '@/app/lib/cn';

export function NavDropdownShellDecor({ lightMode }: { lightMode: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={cn(
          'absolute inset-0',
          lightMode
            ? 'bg-gradient-to-br from-[#FAF7F2] via-[#F5F0EA] to-[#EDE4D8]'
            : 'bg-gradient-to-br from-[#2c2420] via-[#3d322c] to-[#4a3d35]',
        )}
      />
      <div
        className={cn(
          'absolute -left-24 bottom-0 h-64 w-64 rounded-full blur-3xl',
          lightMode ? 'bg-[#cdb08e]/20' : 'bg-[#b8966e]/14',
        )}
      />
      <div
        className={cn(
          'absolute right-[28%] top-0 h-48 w-48 rounded-full blur-3xl',
          lightMode ? 'bg-[#8fb4b8]/12' : 'bg-[#8fb4b8]/10',
        )}
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b8966e]/30 to-transparent"
        aria-hidden
      />
    </div>
  );
}

function NavMegaLinkList({
  links,
  lightMode,
  lp,
}: {
  links: { label: string; href: string }[];
  lightMode: boolean;
  lp: (href: string) => string;
}) {
  return (
    <ul
      className={cn(
        'overflow-hidden rounded-xl',
        lightMode
          ? 'divide-y divide-[#b8966e]/10 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]'
          : 'divide-y divide-white/[0.06] border border-white/[0.06] bg-white/[0.04]',
      )}
    >
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={lp(link.href)}
            className={cn(
              'group flex items-center justify-between gap-3 px-3.5 py-3 transition-colors',
              lightMode
                ? 'text-[#2c2420]/82 hover:bg-white/80 hover:text-[#2c2420]'
                : 'text-white/82 hover:bg-white/[0.06] hover:text-white',
            )}
          >
            <span className="text-[14px] font-medium">{link.label}</span>
            <ArrowUpRight
              className={cn(
                'h-[15px] w-[15px] shrink-0 transition-all',
                lightMode
                  ? 'text-[#b8966e]/35 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#b8966e]'
                  : 'text-white/25 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/60',
              )}
              strokeWidth={1.5}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NavMegaSpotlightCard({
  spotlight,
  lp,
}: {
  spotlight: NavMegaSpotlight;
  lp: (href: string) => string;
}) {
  return (
    <Link
      href={lp(spotlight.href)}
      className="relative block h-[300px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)]"
    >
      <Image src={spotlight.image} alt={spotlight.imageAlt} fill sizes="320px" className="object-cover" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(44,36,32,0.78) 0%, rgba(44,36,32,0.28) 42%, rgba(44,36,32,0.18) 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(44,36,32,0.08) 0%, rgba(44,36,32,0.68) 68%, rgba(44,36,32,0.96) 100%)',
        }}
        aria-hidden
      />

      <div
        className="relative z-10 flex h-full flex-col justify-end p-4"
        style={{ textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#cdb08e]">{spotlight.eyebrow}</p>
        <h3 className="font-serif text-xl font-normal leading-snug text-white">{spotlight.title}</h3>
        <p className="mt-2 line-clamp-2 text-[12px] font-light leading-relaxed text-white/75">{spotlight.detail}</p>
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/92 backdrop-blur-sm">
          {spotlight.cta}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

export function useNavMegaMenu(onOpenChange?: (open: boolean) => void) {
  const [activeId, setActiveId] = useState<NavMegaItem['id'] | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (id: NavMegaItem['id']) => {
      clearCloseTimer();
      setActiveId(id);
      onOpenChange?.(true);
    },
    [clearCloseTimer, onOpenChange],
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      setActiveId(null);
      onOpenChange?.(false);
    }, 120);
  }, [clearCloseTimer, onOpenChange]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setActiveId(null);
    onOpenChange?.(false);
  }, [clearCloseTimer, onOpenChange]);

  return { activeId, openMenu, closeMenu, scheduleClose, clearCloseTimer };
}

function NavMegaTrigger({
  item,
  isActive,
  lightMode,
  onOpen,
  onClose,
}: {
  item: NavMegaItem;
  isActive: boolean;
  lightMode: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isActive}
      aria-controls={`nav-mega-${item.id}`}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onMouseLeave={onClose}
      onBlur={onClose}
      className={cn(
        'group relative isolate flex items-center gap-1 rounded-full px-3 py-2 text-[12.5px] font-medium tracking-wide transition-colors duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-3.5 sm:text-[13px]',
        isActive
          ? 'text-white'
          : lightMode
            ? 'text-[#2c2420]/85 hover:text-white'
            : 'text-white/85 hover:text-white',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 -z-10 rounded-full transition-[opacity,background,box-shadow] duration-200',
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
        style={{
          background: isActive ? aveloraNavGradient : `linear-gradient(135deg, ${aveloraBrand.charcoal} 0%, ${aveloraBrand.taupe} 100%)`,
          boxShadow: isActive
            ? '0 10px 24px -10px rgba(184,150,110,0.45), inset 0 1px 0 rgba(255,255,255,0.22)'
            : lightMode
              ? '0 8px 20px -8px rgba(44,36,32,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'
              : '0 8px 20px -8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      />
      <span className="relative">{item.label}</span>
      <ChevronDown
        className={cn(
          'relative h-3.5 w-3.5 transition-transform duration-300',
          isActive ? 'rotate-180 opacity-100' : 'opacity-70 group-hover:opacity-100',
        )}
        strokeWidth={2}
      />
    </button>
  );
}

export function NavMegaMenuTriggers({
  lightMode,
  menuOpen,
  activeId,
  openMenu,
  scheduleClose,
}: {
  lightMode: boolean;
  menuOpen: boolean;
  activeId: NavMegaItem['id'] | null;
  openMenu: (id: NavMegaItem['id']) => void;
  scheduleClose: () => void;
}) {
  const t = useTranslations();
  const items = useMemo(() => getNavMegaMenu(t), [t]);

  return (
    <nav className="flex flex-1 items-center justify-center" aria-label="Main">
      <div
        className={cn(
          'flex items-center gap-0.5 rounded-xl border border-transparent p-1 transition-colors duration-200',
          menuOpen || activeId
            ? lightMode
              ? 'bg-[#2c2420]/[0.04]'
              : 'bg-white/[0.08]'
            : lightMode
              ? 'bg-[#2c2420]/[0.03]'
              : 'bg-white/[0.06]',
        )}
        onMouseLeave={scheduleClose}
      >
        {items.map((item) => (
          <NavMegaTrigger
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            lightMode={lightMode}
            onOpen={() => openMenu(item.id)}
            onClose={scheduleClose}
          />
        ))}
      </div>
    </nav>
  );
}

export function NavMegaMenuPanel({
  lightMode,
  activeId,
  clearCloseTimer,
  scheduleClose,
  unifiedShell = false,
}: {
  lightMode: boolean;
  activeId: NavMegaItem['id'] | null;
  clearCloseTimer: () => void;
  scheduleClose: () => void;
  unifiedShell?: boolean;
}) {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const items = useMemo(() => getNavMegaMenu(t), [t]);
  const activeItem = items.find((item) => item.id === activeId) ?? null;
  const isHelp = activeItem?.id === 'help';
  const contactVariant = lightMode ? 'mega-light' : 'mega-dark';

  const columnTitleClass = cn(
    'mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]',
    lightMode ? 'text-[#b8966e]/90' : 'text-[#cdb08e]/80',
  );

  const panelContent = activeItem ? (
    <div className="relative z-[1] px-5 py-6 lg:px-7 lg:py-7">
      {isHelp ? (
        <div className="grid h-[300px] grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_300px] gap-8">
          <div className="min-h-0 overflow-y-auto pr-1">
            <NavContactCards variant={contactVariant} compact />
          </div>

          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
            {activeItem.columns.map((column) => (
              <div key={column.title}>
                <p className={columnTitleClass}>{column.title}</p>
                <NavMegaLinkList links={column.links} lightMode={lightMode} lp={lp} />
              </div>
            ))}
          </div>

          <div className="h-[300px] shrink-0">
            <NavMegaSpotlightCard spotlight={activeItem.spotlight} lp={lp} />
          </div>
        </div>
      ) : (
        <div className="grid h-[300px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px] gap-10">
          {activeItem.columns.map((column) => (
            <div key={column.title} className="flex min-h-0 flex-col overflow-hidden">
              <p className={columnTitleClass}>{column.title}</p>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <NavMegaLinkList links={column.links} lightMode={lightMode} lp={lp} />
              </div>
            </div>
          ))}
          <div className="h-[300px] shrink-0">
            <NavMegaSpotlightCard spotlight={activeItem.spotlight} lp={lp} />
          </div>
        </div>
      )}
    </div>
  ) : null;

  if (unifiedShell) {
    if (!activeItem) return null;

    return (
      <div
        id={`nav-mega-${activeItem.id}`}
        role="region"
        aria-label={activeItem.label}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
        className="pointer-events-auto relative z-[1] h-[368px] overflow-hidden"
      >
        {panelContent}
      </div>
    );
  }

  return null;
}
