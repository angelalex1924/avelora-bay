'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Lock, Mail, User } from 'lucide-react';
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
import { getAuthErrorCode, getAuthErrorMessage } from '@/app/lib/auth/auth-errors';
import { useAuth } from '@/app/lib/auth/auth-context';
import { AcronWebIdBanner } from '@/app/components/navigation/acron-web-id-banner';
import { useTranslations } from '@/app/lib/i18n/locale-context';

type AuthSignInPromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Mode = 'login' | 'register' | 'reset';

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        fill="#FFC107"
      />
      <path
        d="M6.306 14.691l6.571 4.819C14.655 15.108 19.000 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        fill="#FF3D00"
      />
      <path
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.31 0-9.62-3.317-11.285-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        fill="#4CAF50"
      />
      <path
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        fill="#1976D2"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden className="h-4 w-4">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
    </svg>
  );
}

export function AuthFormCard({
  mobile,
  mode,
  onModeChange,
  onSuccess,
  compactCheckout = false,
}: {
  mobile?: boolean;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onSuccess: () => void;
  compactCheckout?: boolean;
}) {
  const a = useTranslations().auth;
  const { signInWithEmail, registerWithEmail, signInWithGoogle, signInWithApple, resetPassword } =
    useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  function go(next: Mode) {
    onModeChange(next);
    setError(null);
    setSuccess(null);
  }

  async function handleGoogle() {
    setSocialLoading('google');
    setError(null);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err) {
      const code = getAuthErrorCode(err);
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setError(getAuthErrorMessage(code, a));
      }
    } finally {
      setSocialLoading(null);
    }
  }

  async function handleApple() {
    setSocialLoading('apple');
    setError(null);
    try {
      await signInWithApple();
      onSuccess();
    } catch (err) {
      const code = getAuthErrorCode(err);
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setError(getAuthErrorMessage(code, a));
      }
    } finally {
      setSocialLoading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        onSuccess();
      } else if (mode === 'register') {
        if (!name.trim()) {
          setError(a.errNoName);
          return;
        }
        await registerWithEmail(email, password, name);
        onSuccess();
      } else {
        await resetPassword(email);
        setSuccess(a.resetSent);
      }
    } catch (err) {
      setError(getAuthErrorMessage(getAuthErrorCode(err), a));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={mobile ? (compactCheckout ? 'px-4 pb-4' : 'p-4 pb-6') : ''}>
      {mode === 'reset' && (
        <button
          type="button"
          onClick={() => go('login')}
          className="mb-4 inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-[#8a6f5a] hover:text-[#2c2420]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {a.backToSignIn}
        </button>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {mode !== 'reset' && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => void handleGoogle()}
                disabled={Boolean(socialLoading) || loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2c2420]/12 bg-white text-sm font-semibold text-[#2c2420] shadow-[0_12px_24px_-18px_rgba(44,36,32,0.28)] transition-all hover:border-[#b8966e]/35 hover:bg-[#faf7f2] disabled:opacity-70"
              >
                <GoogleMark />
                {socialLoading === 'google' ? a.connectingGoogle : a.continueWithGoogle}
              </button>
              <button
                type="button"
                onClick={() => void handleApple()}
                disabled={Boolean(socialLoading) || loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2c2420]/20 bg-[#2c2420] text-sm font-semibold text-white shadow-[0_12px_24px_-18px_rgba(44,36,32,0.45)] transition-all hover:bg-[#1a1411] disabled:opacity-70"
              >
                <AppleMark />
                {socialLoading === 'apple' ? a.connectingGoogle : a.continueWithApple}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#2c2420]/10" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-[0.12em] text-[#a89080]">
                <span className="bg-white px-2">{a.orDivider}</span>
              </div>
            </div>
          </>
        )}

        <div className="space-y-2.5">
          {mode === 'register' && (
            <label className="relative block">
              <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#b8966e]/80" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={a.fullName}
                autoComplete="name"
                required
                className="h-11 w-full rounded-xl border border-[#2c2420]/12 bg-[#faf7f2]/50 pl-10 pr-3 text-sm text-[#2c2420] outline-none transition-all placeholder:text-[#a89080] focus:border-[#b8966e]/45 focus:shadow-[0_0_0_3px_rgba(184,150,110,0.14)]"
              />
            </label>
          )}
          <label className="relative block">
            <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#b8966e]/80" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={a.emailAddress}
              autoComplete="username"
              required
              className="h-11 w-full rounded-xl border border-[#2c2420]/12 bg-[#faf7f2]/50 pl-10 pr-3 text-sm text-[#2c2420] outline-none transition-all placeholder:text-[#a89080] focus:border-[#b8966e]/45 focus:shadow-[0_0_0_3px_rgba(184,150,110,0.14)]"
            />
          </label>
          {mode !== 'reset' && (
            <label className="relative block">
              <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#b8966e]/80" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={a.password}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
                minLength={6}
                className="h-11 w-full rounded-xl border border-[#2c2420]/12 bg-[#faf7f2]/50 pl-10 pr-3 text-sm text-[#2c2420] outline-none transition-all placeholder:text-[#a89080] focus:border-[#b8966e]/45 focus:shadow-[0_0_0_3px_rgba(184,150,110,0.14)]"
              />
            </label>
          )}
        </div>

        {error && (
          <p className="rounded-lg border border-red-200/80 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            {success}
          </p>
        )}

        {mode === 'login' && (
          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 text-[#8a6f5a]">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#2c2420]/20 accent-[#b8966e]" defaultChecked />
              {a.rememberMe}
            </label>
            <button
              type="button"
              onClick={() => go('reset')}
              className="font-medium text-[#b8966e] hover:text-[#9a7a58]"
            >
              {a.forgotPassword}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || Boolean(socialLoading)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#cdb08e] via-[#b8966e] to-[#9a7a58] text-sm font-semibold tracking-[0.04em] text-white shadow-[0_16px_28px_-18px_rgba(184,150,110,0.75)] transition-all hover:-translate-y-px disabled:opacity-70"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === 'login' && a.submitSignIn}
          {mode === 'register' && a.submitRegister}
          {mode === 'reset' && a.submitReset}
        </button>

        {mode === 'login' && !compactCheckout && (
          <>
            <AcronWebIdBanner />
            <p className="text-center text-xs text-[#8a6f5a]">
              {a.noAccount}
              <button
                type="button"
                onClick={() => go('register')}
                className="font-medium text-[#2c2420] hover:text-[#b8966e]"
              >
                {a.createAccount}
              </button>
            </p>
          </>
        )}
        {mode === 'login' && compactCheckout && (
          <p className="text-center text-xs text-[#8a6f5a]">
            {a.noAccount}
            <button
              type="button"
              onClick={() => go('register')}
              className="font-medium text-[#2c2420] hover:text-[#b8966e]"
            >
              {a.createAccount}
            </button>
          </p>
        )}
        {mode === 'register' && (
          <p className="text-center text-xs text-[#8a6f5a]">
            <button
              type="button"
              onClick={() => go('login')}
              className="font-medium text-[#b8966e] hover:text-[#9a7a58]"
            >
              {a.alreadyHaveAccount}
            </button>
          </p>
        )}
      </form>
    </div>
  );
}

function AuthHeader({ mobile, mode }: { mobile?: boolean; mode: Mode }) {
  const a = useTranslations().auth;
  const title =
    mode === 'login' ? a.welcomeTitle : mode === 'register' ? a.register : a.resetPassword;
  const description =
    mode === 'login'
      ? a.welcomeDescription
      : mode === 'register'
        ? a.taglineRegister
        : a.taglineReset;

  if (mobile) {
    return (
      <div className="border-b border-[#b8966e]/10 px-4 pb-3 pt-1">
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription className="mt-1">{description}</DrawerDescription>
      </div>
    );
  }

  return (
    <div className="border-b border-[#b8966e]/10 px-6 pb-4 pt-6">
      <DialogTitle className="text-[1.35rem]">{title}</DialogTitle>
      <DialogDescription className="mt-1.5">{description}</DialogDescription>
    </div>
  );
}

export function AuthSignInPrompt({ open, onOpenChange }: AuthSignInPromptProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mode, setMode] = useState<Mode>('login');

  useEffect(() => {
    if (!open) {
      setMode('login');
    }
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleSuccess = () => onOpenChange(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <AuthHeader mobile mode={mode} />
            <div className="max-h-[min(72dvh,560px)] overflow-y-auto overscroll-contain">
              <AuthFormCard mobile mode={mode} onModeChange={setMode} onSuccess={handleSuccess} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[512px] overflow-hidden rounded-2xl border border-[#2c2420]/10 bg-white p-0 shadow-[0_34px_72px_-28px_rgba(44,36,32,0.42)]">
        <AuthHeader mode={mode} />
        <div className="px-6 pb-6 pt-4">
          <AuthFormCard mode={mode} onModeChange={setMode} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
