'use client';

import { CartProvider } from '@/app/lib/cart/cart-context';
import { AuthProvider } from '@/app/lib/auth/auth-context';
import { LocaleProvider } from '@/app/lib/i18n/locale-context';
import type { Locale } from '@/app/lib/i18n/locales';
import { FirebaseAnalytics } from '@/app/components/firebase-analytics';
import Footer from '@/app/components/footer';
import { Navigation } from '@/app/components/navigation/navigation';

export function AppProviders({
  children,
  locale = 'gr',
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  return (
    <LocaleProvider locale={locale}>
      <AuthProvider>
        <CartProvider>
          <FirebaseAnalytics />
          <div className="avelora-app-shell">
            <Navigation />
            {children}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
