'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, ShoppingBag } from 'lucide-react';
import { cn } from '@/app/lib/cn';
import { useCart } from '@/app/lib/cart/cart-context';
import { useAuth } from '@/app/lib/auth/auth-context';
import { auth } from '@/app/lib/firebase/client';
import { startShopifyCheckout } from '@/app/lib/checkout/start-checkout';
import { mapCheckoutError } from '@/app/lib/checkout/checkout-errors';
import { useNavDropdown } from '@/app/lib/nav/use-nav-dropdown';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/app/components/ui/drawer';
import { CheckoutSignInPrompt } from '@/app/components/navigation/checkout-sign-in-prompt';

type NavCartDropdownProps = {
  isLight: boolean;
  size?: 'md' | 'compact';
};

function getCheckoutAuthOptions() {
  const fbUser = auth.currentUser;
  return {
    userId: fbUser?.uid,
    userEmail: fbUser?.email ?? undefined,
  };
}

function CartPanel({
  isLight,
  compact,
  items,
  count,
  subtotal,
  checkoutLoading,
  checkoutError,
  onRemoveItem,
  onBrowseShop,
  onCheckout,
  browseShopHref,
  c,
  brandName,
}: {
  isLight: boolean;
  compact?: boolean;
  items: ReturnType<typeof useCart>['items'];
  count: number;
  subtotal: number;
  checkoutLoading: boolean;
  checkoutError: string | null;
  onRemoveItem: (id: string) => void;
  onBrowseShop: () => void;
  onCheckout: () => void;
  browseShopHref: string;
  c: ReturnType<typeof useTranslations>['cart'];
  brandName: string;
}) {
  return (
    <>
      <div
        className={cn(
          'flex items-start justify-between gap-3 border-b px-4 py-3.5',
          isLight ? 'border-[#b8966e]/12 bg-[#faf7f2]/80' : 'border-white/10 bg-white/5',
        )}
      >
        <div>
          <p
            className={cn(
              'text-[0.52rem] font-semibold uppercase tracking-[0.2em]',
              isLight ? 'text-[#b8966e]' : 'text-[#cdb08e]',
            )}
          >
            {brandName}
          </p>
          <h3 className={cn('font-serif text-[1.05rem] font-normal', isLight ? 'text-[#2c2420]' : 'text-white')}>
            {c.title}
          </h3>
        </div>
        {count > 0 && (
          <span className="rounded-full bg-[#b8966e]/15 px-2.5 py-1 text-[0.62rem] font-semibold text-[#b8966e]">
            {count} {count === 1 ? c.item : c.items}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <span
            className={cn(
              'mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl',
              isLight ? 'bg-[#f5efe6] text-[#b8966e]' : 'bg-white/8 text-[#cdb08e]',
            )}
          >
            <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <p className={cn('font-serif text-[1rem]', isLight ? 'text-[#2c2420]' : 'text-white')}>{c.emptyTitle}</p>
          <p className={cn('mt-1.5 text-[0.78rem] leading-relaxed', isLight ? 'text-[#8a6f5a]' : 'text-white/60')}>
            {c.emptyMessage}
          </p>
          <Link
            href={browseShopHref}
            onClick={onBrowseShop}
            className="mt-4 inline-flex rounded-xl bg-gradient-to-br from-[#cdb08e] via-[#b8966e] to-[#9a7a58] px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white"
          >
            {c.browseShop}
          </Link>
        </div>
      ) : (
        <>
          <ul className={cn('overflow-y-auto px-3 py-2', compact ? 'max-h-[min(46dvh,280px)]' : 'max-h-[min(52vh,320px)]')}>
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'flex gap-3 rounded-xl px-2 py-2.5',
                  isLight ? 'hover:bg-[#faf7f2]' : 'hover:bg-white/6',
                )}
              >
                <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#f5efe6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  {item.category && (
                    <p className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-[#b8966e]">
                      {item.category}
                    </p>
                  )}
                  <p className={cn('truncate text-[0.82rem] font-medium', isLight ? 'text-[#2c2420]' : 'text-white')}>
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[0.78rem] text-[#b8966e]">
                    {item.price}
                    {item.qty > 1 ? ` × ${item.qty}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className={cn(
                    'self-start text-[0.62rem] font-medium uppercase tracking-[0.08em]',
                    isLight ? 'text-[#8a6f5a] hover:text-[#2c2420]' : 'text-white/45 hover:text-white',
                  )}
                >
                  {c.remove}
                </button>
              </li>
            ))}
          </ul>
          <div className={cn('border-t px-4 py-3.5', isLight ? 'border-[#b8966e]/12' : 'border-white/10')}>
            <div className="mb-3 flex items-center justify-between text-[0.82rem]">
              <span className={isLight ? 'text-[#8a6f5a]' : 'text-white/60'}>{c.subtotal}</span>
              <strong className={isLight ? 'text-[#2c2420]' : 'text-white'}>€{subtotal.toFixed(2)}</strong>
            </div>
            {checkoutError === 'no_variants' ? (
              <p className="mb-3 text-[0.72rem] leading-relaxed text-[#8a6f5a]">{c.checkoutNeedsShopifyHint}</p>
            ) : null}
            {checkoutError === 'items_unavailable' ? (
              <p className="mb-3 text-[0.72rem] leading-relaxed text-[#8a6f5a]">{c.checkoutItemsUnavailable}</p>
            ) : null}
            {checkoutError === 'failed' ? (
              <p className="mb-3 text-[0.72rem] text-red-600">{c.checkoutUnavailable}</p>
            ) : null}
            <button
              type="button"
              onClick={onCheckout}
              disabled={checkoutLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#cdb08e] via-[#b8966e] to-[#9a7a58] px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-70"
            >
              {checkoutLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {checkoutLoading ? c.checkoutRedirecting : c.checkout}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export function NavCartDropdown({ isLight, size = 'md' }: NavCartDropdownProps) {
  const t = useTranslations();
  const c = t.cart;
  const { lp } = useLocalizedPath();
  const router = useRouter();
  const { items, count, subtotal, removeItem } = useCart();
  const { user } = useAuth();
  const compact = size === 'compact';
  const panelWidth = 380;
  const [isMobile, setIsMobile] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutPromptOpen, setCheckoutPromptOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const runCheckout = useCallback(async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const authOptions = getCheckoutAuthOptions();
      await startShopifyCheckout(items, {
        userId: user?.uid ?? authOptions.userId,
        userEmail: user?.email ?? authOptions.userEmail,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'failed';
      setCheckoutError(mapCheckoutError(message));
      setCheckoutLoading(false);
      throw err;
    }
  }, [items, user?.uid, user?.email]);

  const { open, toggle, close, mounted, position, rootRef, buttonRef, dataAttribute } = useNavDropdown({
    panelWidth,
    dataAttribute: 'data-cart-dropdown',
  });

  function closeCartSurfaces() {
    setCartDrawerOpen(false);
    close();
  }

  function handleBrowseShop() {
    closeCartSurfaces();
    window.location.href = lp('/shop');
  }

  function handleCheckoutClick() {
    if (items.length === 0) return;

    if (user) {
      void runCheckout().then(() => closeCartSurfaces());
      return;
    }

    closeCartSurfaces();
    setCheckoutPromptOpen(true);
  }

  function handleGuestCheckout() {
    setCheckoutPromptOpen(false);
    closeCartSurfaces();
    router.push(lp('/checkout?guest=1'));
  }

  async function handleAuthenticatedCheckout() {
    try {
      await runCheckout();
    } catch {
      setCheckoutPromptOpen(true);
    }
  }

  function handleCartToggle() {
    if (isMobile) {
      setCartDrawerOpen((prev) => !prev);
      return;
    }
    toggle();
  }

  const cartPanelProps = {
    isLight,
    compact,
    items,
    count,
    subtotal,
    checkoutLoading,
    checkoutError,
    onRemoveItem: removeItem,
    onBrowseShop: handleBrowseShop,
    onCheckout: handleCheckoutClick,
    browseShopHref: lp('/shop'),
    c,
    brandName: t.common.brandName,
  };

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          {...{ [dataAttribute]: true }}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ top: position.top, right: position.right, width: panelWidth }}
          className={cn(
            'fixed z-[200] overflow-hidden rounded-2xl backdrop-blur-xl',
            isLight
              ? 'border border-[#2c2420]/10 bg-white/95 shadow-[0_22px_56px_-24px_rgba(44,36,32,0.4)]'
              : 'border border-white/14 bg-[#2c2420]/94 shadow-[0_22px_56px_-24px_rgba(0,0,0,0.55)]',
          )}
        >
          <CartPanel {...cartPanelProps} />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={t.nav.cart}
        aria-expanded={isMobile ? cartDrawerOpen : open}
        onClick={handleCartToggle}
        className={cn(
          'relative inline-flex items-center justify-center rounded-xl border transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          compact ? 'h-9 w-9' : 'h-10 w-10',
          isLight
            ? 'border-[#2c2420]/12 text-[#2c2420]/85 hover:border-[#b8966e]/35 hover:bg-[#2c2420]/5 hover:text-[#2c2420]'
            : 'border-white/16 text-white/88 hover:border-white/28 hover:bg-white/12 hover:text-white',
        )}
      >
        <ShoppingBag className={cn(compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} strokeWidth={2} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b8966e] px-1 text-[0.55rem] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {mounted && !isMobile ? createPortal(dropdown, document.body) : null}

      <Drawer open={isMobile && cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
        <DrawerContent className="bg-white">
          <div className="mx-auto w-full max-w-md">
            <div className="border-b border-[#b8966e]/10 px-4 pb-2 pt-1">
              <DrawerTitle className="sr-only">{c.title}</DrawerTitle>
              <DrawerDescription className="sr-only">{c.emptyMessage}</DrawerDescription>
            </div>
            <div className="max-h-[min(72dvh,560px)] overflow-y-auto overscroll-contain">
              <CartPanel {...cartPanelProps} isLight />
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <CheckoutSignInPrompt
        open={checkoutPromptOpen}
        onOpenChange={setCheckoutPromptOpen}
        onGuestContinue={handleGuestCheckout}
        onAuthenticatedContinue={handleAuthenticatedCheckout}
        guestLoading={checkoutLoading}
      />
    </div>
  );
}
