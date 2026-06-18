'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/lib/auth/auth-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

export function AccountGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const { lp } = useLocalizedPath();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      router.replace(lp('/'));
    }
  }, [isLoggedIn, loading, router, lp]);

  if (loading || !isLoggedIn) {
    return (
      <div className="account-page account-page--loading" data-nav-theme="light">
        <Loader2 className="account-page__spinner" aria-hidden />
      </div>
    );
  }

  return children;
}
