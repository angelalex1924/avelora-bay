'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/app/lib/cn';
import { useLocale, useTranslations } from '@/app/lib/i18n/locale-context';
import { getLocaleOption, LOCALE_OPTIONS, type Locale } from '@/app/lib/i18n/locales';

type LanguageToggleProps = {
  isLight: boolean;
  size?: 'md' | 'compact';
};

type DropdownPosition = {
  top: number;
  right: number;
};

function FlagImage({ src, size = 'md' }: { src: string; size?: 'sm' | 'md' }) {
  const compact = size === 'sm';
  return (
    <Image
      src={src}
      alt=""
      width={compact ? 20 : 24}
      height={compact ? 14 : 16}
      className={cn('shrink-0 object-contain', compact ? 'h-3.5 w-5' : 'h-4 w-6')}
    />
  );
}

export function LanguageToggle({ isLight, size = 'md' }: LanguageToggleProps) {
  const t = useTranslations();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, right: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const compact = size === 'compact';
  const active = getLocaleOption(locale);

  const close = useCallback(() => setOpen(false), []);

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('[data-lang-dropdown]')) return;
      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const selectLocale = (code: Locale) => {
    close();
    setLocale(code);
  };

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          data-lang-dropdown
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ top: position.top, right: position.right }}
          className={cn(
            'fixed z-[200] min-w-[11.5rem] overflow-hidden rounded-2xl p-1.5 backdrop-blur-xl',
            isLight
              ? 'border border-[#2c2420]/10 bg-white/95 shadow-[0_18px_48px_-20px_rgba(44,36,32,0.35)]'
              : 'border border-white/14 bg-[#2c2420]/92 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.55)]',
          )}
        >
          <ul id={listId} role="listbox" aria-label={t.common.selectLanguage} className="space-y-0.5">
            {LOCALE_OPTIONS.map((option) => {
              const isActive = option.code === locale;
              return (
                <li key={option.code} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => selectLocale(option.code)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors',
                      isActive
                        ? isLight
                          ? 'bg-[#b8966e]/12 text-[#2c2420]'
                          : 'bg-white/12 text-white'
                        : isLight
                          ? 'text-[#2c2420]/82 hover:bg-[#2c2420]/5'
                          : 'text-white/82 hover:bg-white/8',
                    )}
                  >
                    <FlagImage src={option.flag} />
                    <span className="min-w-0 flex-1 text-[13px] font-medium leading-none">{option.label}</span>
                    {isActive ? (
                      <Check
                        className={cn('h-4 w-4 shrink-0', isLight ? 'text-[#b8966e]' : 'text-[#cdb08e]')}
                        strokeWidth={2.25}
                      />
                    ) : (
                      <span className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={t.common.selectLanguage}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'group inline-flex items-center gap-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          compact ? 'h-9 px-2 pl-2.5' : 'h-10 px-2.5 pl-3',
          isLight
            ? 'bg-[#2c2420]/[0.04] text-[#2c2420]/88 ring-1 ring-[#2c2420]/10 hover:bg-[#2c2420]/[0.07] hover:ring-[#b8966e]/30'
            : 'bg-white/[0.1] text-white/92 ring-1 ring-white/16 hover:bg-white/[0.16] hover:ring-white/28',
          open &&
            (isLight
              ? 'bg-[#2c2420]/[0.08] ring-[#b8966e]/35 shadow-[0_8px_24px_-12px_rgba(44,36,32,0.35)]'
              : 'bg-white/[0.16] ring-white/30 shadow-[0_8px_28px_-12px_rgba(0,0,0,0.45)]'),
        )}
      >
        <FlagImage src={active.flag} size={compact ? 'sm' : 'md'} />
        <span className={cn('font-semibold uppercase tracking-[0.12em]', compact ? 'text-[10px]' : 'text-[11px]')}>
          {active.shortLabel}
        </span>
        <ChevronDown
          className={cn(
            'shrink-0 transition-transform duration-300',
            compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
            open && 'rotate-180',
            isLight ? 'text-[#2c2420]/45 group-hover:text-[#2c2420]/70' : 'text-white/50 group-hover:text-white/75',
          )}
          strokeWidth={2.25}
        />
      </button>

      {mounted ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
