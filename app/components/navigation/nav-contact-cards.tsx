'use client';

import { Clock, Headphones, Mail, MessageSquare, Phone } from 'lucide-react';
import { AVELORA_CONTACT } from '@/app/lib/company-contact';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import { cn } from '@/app/lib/cn';

type NavContactCardsProps = {
  variant: 'mobile' | 'mega-light' | 'mega-dark';
  onNavigate?: () => void;
  compact?: boolean;
};

export function NavContactCards({ variant, onNavigate, compact = false }: NavContactCardsProps) {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const c = t.nav.contactCards;
  const isMobile = variant === 'mobile';
  const lightMode = variant === 'mega-light';

  const cardClass = cn(
    'flex items-start gap-3 rounded-xl border border-transparent transition-colors',
    compact ? 'px-3 py-2.5' : 'px-3.5 py-3',
    isMobile
      ? 'bg-white/[0.06] active:bg-white/[0.1]'
      : lightMode
        ? 'bg-white/55 hover:bg-white/75'
        : 'bg-white/[0.05] hover:bg-white/[0.09]',
  );

  const labelClass = cn(
    'text-[10px] font-semibold uppercase tracking-[0.08em]',
    isMobile || !lightMode ? 'text-white/45' : 'text-[#8a6f5a]',
  );

  const valueClass = cn(
    'mt-0.5 font-bold tracking-wide',
    isMobile || !lightMode ? 'text-white' : 'text-[#2c2420]',
    compact ? 'text-[14px]' : isMobile ? 'text-[15px]' : 'text-[15px]',
  );

  const phoneValueClass = cn(valueClass, !compact && isMobile && 'text-[17px]');

  const iconClass = cn(
    'mt-0.5 h-4 w-4 shrink-0',
    isMobile || !lightMode ? 'text-[#cdb08e]' : 'text-[#b8966e]',
  );

  const hoursClass = cn(
    'flex items-center gap-2 rounded-xl border border-transparent',
    compact ? 'px-3 py-2' : 'px-3.5 py-2.5',
    isMobile || !lightMode ? 'bg-[#b8966e]/12 text-[#e8d4bc]' : 'bg-[#b8966e]/10 text-[#8a6f5a]',
  );

  return (
    <div>
      <div className={cn('flex items-center gap-2.5', compact ? 'mb-2' : 'mb-3')}>
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl border',
            compact ? 'h-8 w-8' : 'h-9 w-9',
            isMobile || !lightMode
              ? 'border-[#b8966e]/25 bg-[#b8966e]/15 text-[#cdb08e]'
              : 'border-[#b8966e]/20 bg-[#b8966e]/12 text-[#b8966e]',
          )}
        >
          <Headphones className="h-4 w-4" strokeWidth={2} />
        </div>
        <div>
          <p
            className={cn(
              'font-bold',
              compact ? 'text-[13px]' : 'text-[14px]',
              isMobile || !lightMode ? 'text-white' : 'text-[#2c2420]',
            )}
          >
            {c.title}
          </p>
          <p
            className={cn(
              compact ? 'text-[10px]' : 'text-[11px]',
              isMobile || !lightMode ? 'text-white/50' : 'text-[#8a6f5a]',
            )}
          >
            {c.subtitle}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <a href={`mailto:${AVELORA_CONTACT.email}`} onClick={onNavigate} className={cardClass}>
          <Mail className={iconClass} strokeWidth={2} />
          <div className="min-w-0">
            <p className={labelClass}>{c.emailLabel}</p>
            <p className={valueClass}>{AVELORA_CONTACT.email}</p>
          </div>
        </a>

        <a href={`tel:${AVELORA_CONTACT.phone.replace(/\s/g, '')}`} onClick={onNavigate} className={cardClass}>
          <Phone className={iconClass} strokeWidth={2} />
          <div className="min-w-0">
            <p className={labelClass}>{c.phoneLabel}</p>
            <p className={phoneValueClass}>{AVELORA_CONTACT.phone}</p>
          </div>
        </a>

        <a href={lp(AVELORA_CONTACT.contactHref)} onClick={onNavigate} className={cardClass}>
          <MessageSquare className={iconClass} strokeWidth={2} />
          <div className="min-w-0">
            <p className={labelClass}>{c.formLabel}</p>
            <p className={cn('mt-0.5 text-[13px] font-semibold', isMobile || !lightMode ? 'text-white' : 'text-[#2c2420]')}>
              {c.formValue}
            </p>
          </div>
        </a>

        <div className={hoursClass}>
          <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <p className="text-[11px] font-medium leading-snug">{c.hours}</p>
        </div>
      </div>
    </div>
  );
}
