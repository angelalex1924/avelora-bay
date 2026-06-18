'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight, LogOut, Package, ShoppingBag } from 'lucide-react';
import { AccountGuard } from '@/app/components/account/account-guard';
import { useAuth } from '@/app/lib/auth/auth-context';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

const ease = [0.16, 1, 0.3, 1] as const;

function AccountContentInner() {
  const t = useTranslations();
  const a = t.accountPage;
  const auth = t.auth;
  const { user, signOut } = useAuth();
  const { lp } = useLocalizedPath();

  const firstName = user?.name.split(' ')[0] ?? 'there';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email[0]?.toUpperCase() ?? '?';

  return (
    <main className="account-page" data-nav-theme="light">
      <section className="account-page__hero">
        <div className="account-page__hero-glow" aria-hidden />
        <div className="account-page__hero-inner">
          <motion.div
            className="account-page__hero-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="account-page__avatar">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="account-page__eyebrow">{auth.myAccount}</p>
              <h1 className="account-page__title">{a.hello.replace('{name}', firstName)}</h1>
              <p className="account-page__email">{user?.email}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="account-page__body">
        <div className="account-page__stack">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: 0.1 }}>
            <Link href={lp('/account/orders')} className="account-page__card">
              <div className="account-page__card-main">
                <div className="account-page__icon">
                  <Package size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="account-page__card-title">{auth.myOrders}</p>
                  <p className="account-page__card-sub">{a.myOrdersSub}</p>
                </div>
              </div>
              <ChevronRight size={18} color="#a89080" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: 0.18 }}>
            <Link href={lp('/shop')} className="account-page__card account-page__card--accent">
              <div className="account-page__card-main">
                <div className="account-page__icon">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="account-page__card-title">{a.shopCtaTitle}</p>
                  <p className="account-page__card-sub">{a.shopCtaSub}</p>
                </div>
              </div>
              <ChevronRight size={18} color="#a89080" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: 0.26 }}>
            <button
              type="button"
              className="account-page__card account-page__card--danger"
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => void signOut()}
            >
              <div className="account-page__card-main">
                <div className="account-page__icon account-page__icon--danger">
                  <LogOut size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="account-page__card-title account-page__card-title--danger">{auth.signOut}</p>
                  <p className="account-page__card-sub">{a.signOutSub}</p>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default function AccountContent() {
  return (
    <AccountGuard>
      <AccountContentInner />
    </AccountGuard>
  );
}
