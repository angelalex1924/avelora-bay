'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { GuestShippingForm } from '@/app/components/checkout/guest-shipping-form';
import { useCart } from '@/app/lib/cart/cart-context';
import { useAuth } from '@/app/lib/auth/auth-context';
import { auth } from '@/app/lib/firebase/client';
import { startShopifyCheckout, type GuestShippingDetails } from '@/app/lib/checkout/start-checkout';
import { mapCheckoutError } from '@/app/lib/checkout/checkout-errors';
import { CheckoutSignInPrompt } from '@/app/components/navigation/checkout-sign-in-prompt';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

function getCheckoutAuthOptions() {
  const fbUser = auth.currentUser;
  return {
    userId: fbUser?.uid,
    userEmail: fbUser?.email ?? undefined,
  };
}

function CheckoutLoading() {
  const c = useTranslations().cart;

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center"
      data-nav-theme="light"
    >
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#b8966e]" />
      <p className="font-serif text-xl text-[#2c2420]">{c.checkoutRedirecting}</p>
    </div>
  );
}

function CheckoutPageContent() {
  const t = useTranslations();
  const c = t.cart;
  const { lp } = useLocalizedPath();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuestFlow = searchParams.get('guest') === '1';
  const { items } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutPromptOpen, setCheckoutPromptOpen] = useState(false);
  const [showGuestShipping, setShowGuestShipping] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const runCheckout = useCallback(
    async (shipping?: GuestShippingDetails) => {
      if (items.length === 0) {
        setError('empty');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const authOptions = getCheckoutAuthOptions();
        await startShopifyCheckout(items, {
          userId: user?.uid ?? authOptions.userId,
          userEmail: user?.email ?? authOptions.userEmail ?? shipping?.email,
          shipping,
        });
      } catch (err) {
        setLoading(false);
        const message = err instanceof Error ? err.message : 'failed';
        setError(mapCheckoutError(message));
        throw err;
      }
    },
    [items, user?.uid, user?.email],
  );

  useEffect(() => {
    if (authLoading || initialized) return;

    if (items.length === 0) {
      setError('empty');
      setInitialized(true);
      return;
    }

    if (user) {
      setInitialized(true);
      void runCheckout();
      return;
    }

    if (isGuestFlow) {
      setShowGuestShipping(true);
      setInitialized(true);
      return;
    }

    setCheckoutPromptOpen(true);
    setInitialized(true);
  }, [authLoading, initialized, isGuestFlow, items.length, runCheckout, user]);

  function handleGuestContinue() {
    router.push(lp('/checkout?guest=1'));
  }

  if (showGuestShipping && !user) {
    return (
      <GuestShippingForm
        loading={loading}
        error={error === 'no_variants' || error === 'items_unavailable' ? error : error === 'failed' ? 'failed' : null}
        onSubmit={async (shipping) => {
          try {
            await runCheckout(shipping);
          } catch {
            setShowGuestShipping(true);
          }
        }}
      />
    );
  }

  return (
    <>
      <div
        className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center"
        data-nav-theme="light"
      >
        {loading && !error ? (
          <>
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#b8966e]" />
            <p className="font-serif text-xl text-[#2c2420]">{c.checkoutRedirecting}</p>
            <p className="mt-2 max-w-md text-sm text-[#8a6f5a]">{c.checkoutRedirectingHint}</p>
          </>
        ) : null}

        {error === 'empty' ? (
          <>
            <p className="font-serif text-xl text-[#2c2420]">{c.emptyTitle}</p>
            <Link href={lp('/shop')} className="btn btn-primary mt-5">
              {c.browseShop}
            </Link>
          </>
        ) : null}

        {error === 'no_variants' && !showGuestShipping ? (
          <>
            <p className="font-serif text-xl text-[#2c2420]">{c.checkoutNeedsShopify}</p>
            <p className="mt-2 max-w-md text-sm text-[#8a6f5a]">{c.checkoutNeedsShopifyHint}</p>
            <Link href={lp('/shop')} className="btn btn-primary mt-5">
              {c.browseShop}
            </Link>
          </>
        ) : null}

        {error === 'items_unavailable' && !showGuestShipping ? (
          <>
            <p className="font-serif text-xl text-[#2c2420]">{c.checkoutUnavailable}</p>
            <p className="mt-2 max-w-md text-sm text-[#8a6f5a]">{c.checkoutItemsUnavailable}</p>
            <Link href={lp('/shop')} className="btn btn-primary mt-5">
              {c.browseShop}
            </Link>
          </>
        ) : null}

        {error === 'failed' && !showGuestShipping ? (
          <>
            <p className="font-serif text-xl text-[#2c2420]">{c.checkoutUnavailable}</p>
            <button
              type="button"
              className="btn btn-primary mt-5"
              onClick={() => {
                setError(null);
                if (user) void runCheckout();
                else if (isGuestFlow) setShowGuestShipping(true);
                else setCheckoutPromptOpen(true);
              }}
            >
              {c.checkoutRetry}
            </button>
          </>
        ) : null}
      </div>

      <CheckoutSignInPrompt
        open={checkoutPromptOpen}
        onOpenChange={(open) => {
          setCheckoutPromptOpen(open);
          if (!open && !user && !loading && !error && !isGuestFlow) {
            router.back();
          }
        }}
        onGuestContinue={handleGuestContinue}
        onAuthenticatedContinue={async () => {
          await runCheckout();
        }}
        guestLoading={loading}
        checkoutError={
          error === 'no_variants' || error === 'items_unavailable'
            ? error
            : error === 'failed'
              ? 'failed'
              : null
        }
      />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
