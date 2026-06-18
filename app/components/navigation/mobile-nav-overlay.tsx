'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  ShoppingBag,
  Compass,
  Headphones,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { getNavMegaMenu, type NavMegaItem, type NavMegaSpotlight, type NavMegaItemId } from '@/app/lib/nav-mega-menu';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import { NavMenuButton } from '@/app/components/navigation/nav-menu-button';
import { MobileNavPromoStrip } from '@/app/components/navigation/mobile-nav-promo-strip';
import { MobileNavAccountSection } from '@/app/components/navigation/mobile-nav-account-section';
import { NavContactCards } from '@/app/components/navigation/nav-contact-cards';
import { cn } from '@/app/lib/cn';

const easeOut = [0.32, 0.72, 0, 1] as const;
const easeInOut = [0.16, 1, 0.3, 1] as const;

const navIcons: Record<NavMegaItemId, LucideIcon> = {
  shop: ShoppingBag,
  discover: Compass,
  help: Headphones,
};

function MobileNavWatermark() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <div
        className="absolute bottom-[10%] left-1/2 h-[min(72vw,380px)] w-[min(72vw,380px)] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(184,150,110,0.16) 0%, rgba(143,180,184,0.08) 42%, transparent 72%)',
        }}
      />
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 opacity-[0.045]">
        <Image src="/avelora-bay.PNG" alt="" width={280} height={280} className="h-[min(55vw,300px)] w-auto object-contain" />
      </div>
    </div>
  );
}

function MobileSpotlightCard({
  spotlight,
  lp,
}: {
  spotlight: NavMegaSpotlight;
  lp: (href: string) => string;
}) {
  return (
    <Link href={lp(spotlight.href)} className="relative isolate block h-[168px] overflow-hidden rounded-2xl">
      <Image src={spotlight.image} alt={spotlight.imageAlt} fill sizes="(max-width: 640px) 100vw, 420px" className="object-cover" />
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
        className="relative z-10 flex h-full flex-col justify-end p-3.5"
        style={{ textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#cdb08e]">{spotlight.eyebrow}</p>
        <h3 className="font-serif text-lg font-normal leading-snug text-white">{spotlight.title}</h3>
        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
          {spotlight.cta}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

function MobileNavSection({
  item,
  desc,
  expanded,
  onToggle,
  onClose,
  index,
  lp,
}: {
  item: NavMegaItem;
  desc: string;
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
  index: number;
  lp: (href: string) => string;
}) {
  const Icon = navIcons[item.id];

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 + index * 0.06, duration: 0.5, ease: easeOut }}
      className="overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-white/[0.055] to-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_16px_-8px_rgba(0,0,0,0.4)]"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-4 py-[14px] text-left transition-colors active:bg-white/[0.03]"
      >
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#b8966e]/25 bg-gradient-to-br from-[#b8966e]/25 to-[#b8966e]/10 shadow-[0_0_12px_rgba(184,150,110,0.15)]">
            <Icon className="h-[18px] w-[18px] text-[#cdb08e]" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[17px] font-medium tracking-[-0.01em] text-white/95">{item.label}</p>
            <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.15em] text-white/38">{desc}</p>
          </div>
        </div>
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300',
            expanded ? 'bg-white/10 text-white/80' : 'bg-white/[0.05] text-white/40',
          )}
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', expanded && 'rotate-180')} strokeWidth={2} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: easeInOut }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.07] px-4 pb-4 pt-3">
              {item.id === 'help' ? (
                <div className="mb-4">
                  <NavContactCards variant="mobile" onNavigate={onClose} />
                </div>
              ) : null}

              <MobileSpotlightCard spotlight={item.spotlight} lp={lp} />

              <div className="mt-4 space-y-4">
                {item.columns.map((column) => (
                  <div key={column.title}>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#cdb08e]/80">
                      {column.title}
                    </p>
                    <ul className="overflow-hidden rounded-xl border border-white/[0.04] bg-black/20">
                      {column.links.map((link) => (
                        <li key={link.label} className="border-b border-white/[0.04] last:border-b-0">
                          <Link
                            href={lp(link.href)}
                            onClick={onClose}
                            className="group flex items-center justify-between gap-3 px-3.5 py-3 transition-colors active:bg-white/[0.04]"
                          >
                            <span className="text-[14px] font-medium text-white/82 transition-colors group-active:text-white">
                              {link.label}
                            </span>
                            <ArrowUpRight
                              className="h-[15px] w-[15px] shrink-0 text-white/25 transition-all group-active:translate-x-0.5 group-active:-translate-y-0.5 group-active:text-white/60"
                              strokeWidth={1.5}
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function MobileNavOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<NavMegaItemId | null>(null);

  const menuItems = useMemo(() => getNavMegaMenu(t), [t]);

  const menuDesc: Record<NavMegaItemId, string> = {
    shop: t.nav.menuDesc.shop,
    discover: t.nav.menuDesc.discover,
    help: t.nav.menuDesc.help,
  };

  useEffect(() => {
    if (open) setMounted(true);
    if (!open) setExpandedId(null);
  }, [open]);

  useEffect(() => {
    if (!open && !mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, mounted]);

  const handleExitComplete = () => {
    if (!open) setMounted(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {open && (
        <motion.div
          key="mobile-nav-overlay"
          role="dialog"
          aria-modal
          aria-label={t.nav.menu}
          className="fixed inset-0 z-[110] flex flex-col overflow-hidden lg:hidden"
          style={{
            background: 'rgba(44, 36, 32, 0.92)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-none absolute -top-[30%] -left-[30%] z-0 h-[160%] w-[160%]"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(184,150,110,0.14) 0%, transparent 60%)',
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-[20%] -right-[20%] z-0 h-[140%] w-[140%]"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(143,180,184,0.1) 0%, transparent 60%)',
            }}
            aria-hidden
          />

          <MobileNavWatermark />

          <div className="relative z-10 flex h-[64px] shrink-0 items-center justify-between px-4 sm:px-5">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={lp('/')} onClick={onClose} aria-label={t.common.brandName} className="flex items-center">
                <Image src="/avelora-bay.PNG" alt="" width={36} height={36} priority className="h-9 w-9 object-contain" />
              </Link>
            </motion.div>

            <NavMenuButton open tone="hero" size="sm" onClick={onClose} />
          </div>

          <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-4 pb-12 pt-2 sm:px-5 scrollbar-none">
            <div className="relative z-[1] flex min-h-full flex-1 flex-col">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
                className="mb-6"
              >
                <MobileNavPromoStrip promos={t.home.heroPromos} floatEyebrow={t.home.justArrived} lp={lp} />
              </motion.div>

              <MobileNavAccountSection onClose={onClose} />

              <nav aria-label="Mobile">
                <ul className="flex flex-col gap-3">
                  {menuItems.map((item, i) => (
                    <MobileNavSection
                      key={item.id}
                      item={item}
                      desc={menuDesc[item.id]}
                      expanded={expandedId === item.id}
                      onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
                      onClose={onClose}
                      index={i}
                      lp={lp}
                    />
                  ))}
                </ul>
              </nav>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
