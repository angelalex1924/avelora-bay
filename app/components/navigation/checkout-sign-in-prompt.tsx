'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/app/components/ui/drawer';
import { AuthFormCard } from '@/app/components/navigation/auth-sign-in-prompt';
import { useTranslations } from '@/app/lib/i18n/locale-context';

type CheckoutSignInPromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuestContinue: () => void;
  onAuthenticatedContinue: () => void | Promise<void>;
  guestLoading?: boolean;
  checkoutError?: 'no_variants' | 'items_unavailable' | 'failed' | null;
};

type Mode = 'login' | 'register' | 'reset';

function CheckoutPromptHeader({ mobile }: { mobile?: boolean }) {
  const c = useTranslations().cart;
  const Title = mobile ? DrawerTitle : DialogTitle;
  const Description = mobile ? DrawerDescription : DialogDescription;

  return (
    <div className={mobile ? 'shrink-0 border-b border-[#b8966e]/10 px-4 pb-3 pt-1' : 'border-b border-[#b8966e]/10 px-6 pb-4 pt-6'}>
      <Title className={mobile ? undefined : 'text-[1.35rem]'}>{c.checkoutPromptTitle}</Title>
      <Description className={mobile ? 'mt-1' : 'mt-1.5'}>{c.checkoutPromptDescription}</Description>
    </div>
  );
}

function GuestCheckoutButton({
  mobile,
  guestLoading,
  onGuestContinue,
}: {
  mobile?: boolean;
  guestLoading?: boolean;
  onGuestContinue: () => void;
}) {
  const c = useTranslations().cart;

  return (
    <div className={mobile ? 'shrink-0 px-4 pt-3' : 'px-6 pt-5'}>
      <button
        type="button"
        onClick={onGuestContinue}
        disabled={guestLoading}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#b8966e]/45 bg-white text-sm font-semibold tracking-[0.04em] text-[#2c2420] shadow-[0_12px_24px_-18px_rgba(44,36,32,0.2)] transition-all hover:border-[#b8966e]/55 hover:bg-[#faf7f2] disabled:opacity-70"
      >
        {guestLoading ? <Loader2 className="h-4 w-4 animate-spin text-[#b8966e]" /> : null}
        {c.continueAsGuest}
      </button>
      <p className="mt-2 text-center text-[0.72rem] leading-relaxed text-[#8a6f5a]">{c.continueAsGuestHint}</p>
    </div>
  );
}

function CheckoutPromptBody({
  mobile,
  mode,
  onModeChange,
  onAuthenticatedContinue,
  onGuestContinue,
  guestLoading,
  checkoutError,
}: {
  mobile?: boolean;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onAuthenticatedContinue: () => void | Promise<void>;
  onGuestContinue: () => void;
  guestLoading?: boolean;
  checkoutError?: 'no_variants' | 'items_unavailable' | 'failed' | null;
}) {
  const t = useTranslations();
  const c = t.cart;
  const padX = mobile ? 'px-4' : 'px-6';

  async function handleAuthSuccess() {
    await onAuthenticatedContinue();
  }

  return (
    <>
      <GuestCheckoutButton mobile={mobile} guestLoading={guestLoading} onGuestContinue={onGuestContinue} />

      {checkoutError === 'no_variants' ? (
        <p className={`${padX} mt-3 text-[0.72rem] leading-relaxed text-[#8a6f5a]`}>{c.checkoutNeedsShopifyHint}</p>
      ) : null}
      {checkoutError === 'items_unavailable' ? (
        <p className={`${padX} mt-3 text-[0.72rem] leading-relaxed text-[#8a6f5a]`}>{c.checkoutItemsUnavailable}</p>
      ) : null}
      {checkoutError === 'failed' ? (
        <p className={`${padX} mt-3 text-[0.72rem] text-red-600`}>{c.checkoutUnavailable}</p>
      ) : null}

      <div className={`${padX} my-3`}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2c2420]/10" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-[0.12em] text-[#a89080]">
            <span className="bg-white px-2">{t.auth.orDivider}</span>
          </div>
        </div>
      </div>

      <AuthFormCard
        mobile={mobile}
        mode={mode}
        onModeChange={onModeChange}
        onSuccess={() => void handleAuthSuccess()}
        compactCheckout
      />
    </>
  );
}

export function CheckoutSignInPrompt({
  open,
  onOpenChange,
  onGuestContinue,
  onAuthenticatedContinue,
  guestLoading = false,
  checkoutError = null,
}: CheckoutSignInPromptProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mode, setMode] = useState<Mode>('login');

  useEffect(() => {
    if (!open) setMode('login');
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const body = (
    <CheckoutPromptBody
      mobile={isMobile}
      mode={mode}
      onModeChange={setMode}
      onAuthenticatedContinue={async () => {
        onOpenChange(false);
        await onAuthenticatedContinue();
      }}
      onGuestContinue={() => {
        onOpenChange(false);
        onGuestContinue();
      }}
      guestLoading={guestLoading}
      checkoutError={checkoutError}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92dvh]">
          <div className="mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col">
            <CheckoutPromptHeader mobile />
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-8">{body}</div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,720px)] max-w-[512px] overflow-y-auto rounded-2xl border border-[#2c2420]/10 bg-white p-0 shadow-[0_34px_72px_-28px_rgba(44,36,32,0.42)]">
        <CheckoutPromptHeader />
        <div className="pb-6">{body}</div>
      </DialogContent>
    </Dialog>
  );
}
