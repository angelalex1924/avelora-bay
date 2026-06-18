'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, LogOut, Package, User } from 'lucide-react';
import { useAuth, type AuthUser } from '@/app/lib/auth/auth-context';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import { cn } from '@/app/lib/cn';

function getInitials(user: AuthUser) {
  return (
    user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || user.email[0]?.toUpperCase() || '?'
  );
}

export function MobileNavAccountSection({ onClose }: { onClose: () => void }) {
  const t = useTranslations();
  const a = t.auth;
  const { lp } = useLocalizedPath();
  const { user, isLoggedIn, signOut } = useAuth();

  if (!isLoggedIn || !user) return null;

  const initials = getInitials(user);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="mb-6 overflow-hidden rounded-2xl border border-[#b8966e]/25 bg-gradient-to-br from-[#b8966e]/14 to-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_-16px_rgba(0,0,0,0.45)]"
      aria-label={a.myAccount}
    >
      <div className="border-b border-white/[0.08] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#cdb08e] to-[#9a7a58] ring-2 ring-[#b8966e]/35 ring-offset-2 ring-offset-transparent">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-semibold text-white">{initials}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.95rem] font-semibold text-white">{user.name}</p>
            <p className="truncate text-[0.72rem] text-white/50">{user.email}</p>
          </div>
        </div>
      </div>

      <ul className="p-2">
        <li>
          <Link
            href={lp('/account')}
            onClick={onClose}
            className="group flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 transition-colors active:bg-white/[0.05]"
          >
            <span className="flex items-center gap-3 text-[14px] font-medium text-white/88">
              <User className="h-4 w-4 text-[#cdb08e]" strokeWidth={1.5} />
              {a.myAccount}
            </span>
            <ArrowUpRight className="h-4 w-4 text-white/30 transition group-active:text-white/70" />
          </Link>
        </li>
        <li>
          <Link
            href={lp('/account/orders')}
            onClick={onClose}
            className="group flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 transition-colors active:bg-white/[0.05]"
          >
            <span className="flex items-center gap-3 text-[14px] font-medium text-white/88">
              <Package className="h-4 w-4 text-[#cdb08e]" strokeWidth={1.5} />
              {a.myOrders}
            </span>
            <ArrowUpRight className="h-4 w-4 text-white/30 transition group-active:text-white/70" />
          </Link>
        </li>
        <li className="mt-1 border-t border-white/[0.08] pt-1">
          <button
            type="button"
            onClick={() => {
              void signOut();
              onClose();
            }}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[14px] font-medium text-red-300 transition active:bg-red-500/10',
            )}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            {a.signOut}
          </button>
        </li>
      </ul>
    </motion.section>
  );
}
