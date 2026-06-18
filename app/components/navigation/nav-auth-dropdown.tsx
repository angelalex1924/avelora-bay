'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Package, User } from 'lucide-react';
import { cn } from '@/app/lib/cn';
import { useAuth, type AuthUser } from '@/app/lib/auth/auth-context';
import { useNavDropdown } from '@/app/lib/nav/use-nav-dropdown';
import { AuthSignInPrompt } from '@/app/components/navigation/auth-sign-in-prompt';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

type NavAuthDropdownProps = {
  isLight: boolean;
  size?: 'md' | 'compact';
};

function getInitials(user: AuthUser) {
  if (user.name) {
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return user.email?.[0]?.toUpperCase() ?? '?';
}

function NavUserAvatar({
  user,
  size = 'md',
  className,
}: {
  user: AuthUser;
  size?: 'md' | 'compact';
  className?: string;
}) {
  const compact = size === 'compact';
  const dim = compact ? 'h-7 w-7' : 'h-8 w-8';
  const initials = getInitials(user);

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full bg-[#f5efe6] shadow-[0_2px_8px_-4px_rgba(44,36,32,0.3)] ring-1 ring-[#b8966e]/45 ring-offset-1 ring-offset-white',
        dim,
        className,
      )}
    >
      {user.photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.photoURL}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={cn(
            'flex h-full w-full items-center justify-center bg-gradient-to-br from-[#cdb08e] to-[#9a7a58] font-semibold text-white',
            compact ? 'text-[0.5rem]' : 'text-[0.54rem]',
          )}
        >
          {initials}
        </span>
      )}
    </span>
  );
}

export function NavAuthDropdown({ isLight, size = 'md' }: NavAuthDropdownProps) {
  const t = useTranslations();
  const a = t.auth;
  const { lp } = useLocalizedPath();
  const { user, isLoggedIn, signOut } = useAuth();
  const compact = size === 'compact';
  const [authOpen, setAuthOpen] = useState(false);

  const { open, toggle, close, mounted, position, rootRef, buttonRef, dataAttribute } = useNavDropdown({
    panelWidth: 280,
    dataAttribute: 'data-auth-dropdown',
  });

  const accountMenu = (
    <AnimatePresence>
      {open && (
        <motion.div
          {...{ [dataAttribute]: true }}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ top: position.top, right: position.right, width: 280 }}
          className={cn(
            'fixed z-[200] overflow-hidden rounded-2xl backdrop-blur-xl',
            isLight
              ? 'border border-[#2c2420]/10 bg-white/95 shadow-[0_22px_56px_-24px_rgba(44,36,32,0.4)]'
              : 'border border-white/14 bg-[#2c2420]/94 shadow-[0_22px_56px_-24px_rgba(0,0,0,0.55)]',
          )}
        >
          {user ? (
            <>
              <div
                className={cn(
                  'border-b px-4 py-3.5',
                  isLight ? 'border-[#b8966e]/12 bg-[#faf7f2]/80' : 'border-white/10 bg-white/5',
                )}
              >
                <div className="flex items-center gap-3">
                  {user ? (
                    <NavUserAvatar
                      user={user}
                      size="md"
                      className={isLight ? 'ring-offset-[#faf7f2]' : 'ring-offset-[#2c2420]'}
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className={cn('truncate text-[0.88rem] font-semibold', isLight ? 'text-[#2c2420]' : 'text-white')}>
                      {user.name}
                    </p>
                    <p className={cn('truncate text-[0.72rem]', isLight ? 'text-[#8a6f5a]' : 'text-white/55')}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-1.5">
                <AccountLink isLight={isLight} href={lp('/account')} onClick={close} icon={<User className="h-3.5 w-3.5" />}>
                  {a.myAccount}
                </AccountLink>
                <AccountLink isLight={isLight} href={lp('/account/orders')} onClick={close} icon={<Package className="h-3.5 w-3.5" />}>
                  {a.myOrders}
                </AccountLink>
                <div className={cn('my-1 h-px', isLight ? 'bg-[#b8966e]/12' : 'bg-white/10')} />
                <button
                  type="button"
                  onClick={() => {
                    void signOut();
                    close();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.82rem] font-medium transition',
                    isLight ? 'text-red-700 hover:bg-red-50' : 'text-red-300 hover:bg-red-500/10',
                  )}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {a.signOut}
                </button>
              </div>
            </>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-label={isLoggedIn && user ? user.name : t.nav.signIn}
          aria-expanded={isLoggedIn ? open : authOpen}
          onClick={() => {
            if (isLoggedIn) {
              toggle();
            } else {
              setAuthOpen(true);
            }
          }}
          className={cn(
            'inline-flex items-center justify-center transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
            isLoggedIn
              ? 'rounded-full bg-transparent p-0 hover:scale-[1.04] active:scale-[0.98]'
              : cn(
                  'rounded-xl border',
                  compact ? 'h-9 w-9' : 'h-10 w-10',
                  isLight
                    ? 'border-[#2c2420]/12 text-[#2c2420]/85 hover:border-[#b8966e]/35 hover:bg-[#2c2420]/5 hover:text-[#2c2420]'
                    : 'border-white/16 text-white/88 hover:border-white/28 hover:bg-white/12 hover:text-white',
                ),
          )}
        >
          {isLoggedIn && user ? (
            <NavUserAvatar
              user={user}
              size={compact ? 'compact' : 'md'}
              className={isLight ? 'ring-offset-white' : 'ring-offset-[#2c2420]'}
            />
          ) : (
            <User className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} strokeWidth={2} />
          )}
        </button>
        {isLoggedIn && mounted ? createPortal(accountMenu, document.body) : null}
      </div>

      {!isLoggedIn ? <AuthSignInPrompt open={authOpen} onOpenChange={setAuthOpen} /> : null}
    </>
  );
}

function AccountLink({
  isLight,
  href,
  onClick,
  icon,
  children,
}: {
  isLight: boolean;
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.82rem] font-medium transition',
        isLight ? 'text-[#2c2420] hover:bg-[#faf7f2]' : 'text-white/90 hover:bg-white/8',
      )}
    >
      <span className="text-[#b8966e]">{icon}</span>
      {children}
    </Link>
  );
}
