'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin, Phone, User } from 'lucide-react';
import type { GuestShippingDetails } from '@/app/lib/checkout/start-checkout';
import { useTranslations } from '@/app/lib/i18n/locale-context';

type GuestShippingFormProps = {
  loading?: boolean;
  error?: 'no_variants' | 'items_unavailable' | 'failed' | null;
  onSubmit: (shipping: GuestShippingDetails) => void | Promise<void>;
};

export function GuestShippingForm({ loading = false, error, onSubmit }: GuestShippingFormProps) {
  const t = useTranslations();
  const c = t.cart;
  const [shopifyAuthFailed, setShopifyAuthFailed] = useState(false);

  useEffect(() => {
    if (error !== 'no_variants') return;
    void fetch('/api/shopify/status')
      .then((res) => res.json() as Promise<{ status?: string }>)
      .then((data) => setShopifyAuthFailed(data.status === 'auth_failed'))
      .catch(() => setShopifyAuthFailed(false));
  }, [error]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      address1: address1.trim(),
      city: city.trim(),
      zip: zip.trim(),
      country: 'GR',
    });
  }

  const inputClass =
    'h-11 w-full rounded-xl border border-[#2c2420]/12 bg-[#faf7f2]/50 px-3 text-sm text-[#2c2420] outline-none transition-all placeholder:text-[#a89080] focus:border-[#b8966e]/45 focus:shadow-[0_0_0_3px_rgba(184,150,110,0.14)]';

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6" data-nav-theme="light">
      <div className="mb-6 text-center sm:text-left">
        <p className="text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-[#b8966e]">
          {t.common.brandName}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-normal text-[#2c2420]">{c.guestShippingTitle}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#8a6f5a]">{c.guestShippingDescription}</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8a6f5a]">
              {c.guestFirstName}
            </span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#b8966e]/80" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
                className={`${inputClass} pl-10`}
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8a6f5a]">
              {c.guestLastName}
            </span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              required
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8a6f5a]">
            {c.guestEmail}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8a6f5a]">
            {c.guestPhone}
          </span>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#b8966e]/80" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className={`${inputClass} pl-10`}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8a6f5a]">
            {c.guestAddress}
          </span>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#b8966e]/80" />
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              autoComplete="street-address"
              required
              className={`${inputClass} pl-10`}
            />
          </div>
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8a6f5a]">
              {c.guestCity}
            </span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
              required
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8a6f5a]">
              {c.guestPostalCode}
            </span>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              autoComplete="postal-code"
              required
              className={inputClass}
            />
          </label>
        </div>

        {error === 'no_variants' ? (
          <p className="rounded-lg border border-[#b8966e]/25 bg-[#faf7f2] px-3 py-2 text-xs leading-relaxed text-[#8a6f5a]">
            {shopifyAuthFailed ? c.checkoutShopifyAuthFailed : c.checkoutNeedsShopifyHint}
          </p>
        ) : null}
        {error === 'items_unavailable' ? (
          <p className="rounded-lg border border-[#b8966e]/25 bg-[#faf7f2] px-3 py-2 text-xs leading-relaxed text-[#8a6f5a]">
            {c.checkoutItemsUnavailable}
          </p>
        ) : null}
        {error === 'failed' ? (
          <p className="rounded-lg border border-red-200/80 bg-red-50 px-3 py-2 text-xs text-red-700">{c.checkoutUnavailable}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#cdb08e] via-[#b8966e] to-[#9a7a58] text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_16px_28px_-18px_rgba(184,150,110,0.75)] transition-all hover:-translate-y-px disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? c.checkoutRedirecting : c.continueToPayment}
        </button>
        <p className="text-center text-[0.72rem] leading-relaxed text-[#8a6f5a]">{c.continueAsGuestHint}</p>
      </form>
    </div>
  );
}
