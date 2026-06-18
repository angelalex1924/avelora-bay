'use client';

import { AcronWebIdLogo } from '@/app/components/acron-web-id-logo';
import { useTranslations } from '@/app/lib/i18n/locale-context';

const geckoSubtitleStyle = {
  fontFamily: "'Gecko', sans-serif",
  letterSpacing: '0.02em',
} as const;

export function AcronWebIdBanner() {
  const a = useTranslations().auth;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50 via-cyan-50/80 to-white p-4 sm:p-5"
      role="note"
      aria-label={a.acronWebIdBannerAria}
    >
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-full bg-sky-300/10 blur-2xl"
        aria-hidden
      />

      <div className="relative flex items-center gap-3 sm:gap-4">
        <AcronWebIdLogo />

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-[0.08rem]">
            <span
              className="text-base font-bold tracking-tight text-[#38bdf8] sm:text-lg"
              style={{ fontFamily: "'Quizlo', sans-serif", letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              ACRON
            </span>
            <span
              className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-base font-extrabold text-transparent sm:text-lg"
              style={{ fontFamily: "'Gegola', sans-serif", letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              WEB
            </span>
            <span
              className="ml-[0.14em] text-base font-extrabold text-sky-600 sm:text-lg"
              style={{ fontFamily: "'Gegola', sans-serif", letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              ID
            </span>
          </div>

          <p className="mt-1.5 max-w-md text-[11px] leading-snug sm:text-xs">
            <span className="font-medium text-slate-600" style={geckoSubtitleStyle}>
              {a.acronWebIdSubtitleLead}
            </span>
            <span
              className="bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600 bg-clip-text font-medium text-transparent"
              style={geckoSubtitleStyle}
            >
              {a.acronWebIdSubtitleHighlight}
            </span>
            <span className="whitespace-nowrap">
              <span className="font-medium text-slate-600" style={geckoSubtitleStyle}>
                {a.acronWebIdSubtitleTrail}
              </span>
              <span
                className="font-bold tracking-tight text-[#38bdf8]"
                style={{ fontFamily: "'Quizlo', sans-serif", letterSpacing: '-0.02em' }}
              >
                ACRON
              </span>
              <span
                className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 bg-clip-text font-extrabold text-transparent"
                style={{ fontFamily: "'Gegola', sans-serif", letterSpacing: '-0.02em' }}
              >
                WEB
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
