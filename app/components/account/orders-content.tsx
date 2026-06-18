'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Download, Loader2, Package } from 'lucide-react';
import { getIdToken } from 'firebase/auth';
import { AccountGuard } from '@/app/components/account/account-guard';
import { useAuth } from '@/app/lib/auth/auth-context';
import { auth } from '@/app/lib/firebase/client';
import { useOrders } from '@/app/lib/orders/use-orders';
import type { OrderRecord, OrderStatus } from '@/app/lib/orders/order-types';
import { useLocale, useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

function formatOrderDate(date: Date | null, locale: string) {
  if (!date) return '—';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function OrdersContentInner() {
  const t = useTranslations();
  const o = t.ordersPage;
  const { locale: appLocale } = useLocale();
  const locale = appLocale === 'gr' ? 'el' : appLocale;
  const { user } = useAuth();
  const { lp } = useLocalizedPath();
  const { orders, loading } = useOrders(user?.uid);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const statusLabels: Record<OrderStatus, string> = {
    pending: o.statusPending,
    processing: o.statusProcessing,
    shipped: o.statusShipped,
    delivered: o.statusDelivered,
  };

  async function handleDownloadReceipt(order: OrderRecord) {
    if (!auth.currentUser) return;

    setDownloadingId(order.id);
    setDownloadError(null);

    try {
      const token = await getIdToken(auth.currentUser);
      const response = await fetch(`/api/orders/${order.id}/receipt`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-avelora-locale': appLocale,
        },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { code?: string } | null;
        if (response.status === 409 || payload?.code === 'pending') {
          throw new Error('pending');
        }
        if (response.status === 401 || payload?.code === 'auth_invalid') {
          throw new Error('auth');
        }
        if (response.status === 403 || payload?.code === 'forbidden') {
          throw new Error('forbidden');
        }
        throw new Error('failed');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') ?? '';
      const match = disposition.match(/filename="([^"]+)"/);
      const fileName =
        match?.[1] ??
        `shopify-receipt-${order.shopifyOrderName?.replace('#', '') ?? order.orderNumber}.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      const code = error instanceof Error ? error.message : 'failed';
      if (code === 'pending') setDownloadError(o.receiptPending);
      else if (code === 'auth') setDownloadError(o.receiptAuthError);
      else if (code === 'forbidden') setDownloadError(o.receiptForbidden);
      else setDownloadError(o.receiptError);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <main className="account-page" data-nav-theme="light">
      <section className="account-page__hero">
        <div className="account-page__hero-glow" aria-hidden />
        <div className="account-page__hero-inner">
          <Link href={lp('/account')} className="account-page__back">
            <ArrowLeft size={14} />
            {o.backToAccount}
          </Link>
          <div className="account-page__hero-row">
            <div className="account-page__avatar">
              <Package size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="account-page__eyebrow">{t.auth.myOrders}</p>
              <h1 className="account-page__title">{o.title}</h1>
              <p className="account-page__email">{o.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="account-page__body">
        {downloadError ? <p className="account-page__empty-text">{downloadError}</p> : null}

        {loading ? (
          <div className="account-page--loading" style={{ minHeight: '12rem' }}>
            <Loader2 className="account-page__spinner" aria-hidden />
          </div>
        ) : null}

        {!loading && orders.length === 0 ? (
          <div className="account-page__empty">
            <p className="account-page__empty-title">{o.emptyTitle}</p>
            <p className="account-page__empty-text">{o.emptyMessage}</p>
            <Link href={lp('/shop')} className="account-page__btn">
              {o.shopCta}
            </Link>
          </div>
        ) : null}

        {!loading && orders.length > 0 ? (
          <div className="account-page__order-list">
            {orders.map((order) => (
              <article key={order.id} className="account-page__order">
                <div className="account-page__order-head">
                  <div className="account-page__order-meta">
                    <p className="account-page__order-number">
                      {o.orderNumber}{' '}
                      {order.shopifyOrderName ?? order.orderNumber}
                    </p>
                    <p className="account-page__order-date">
                      {o.placedOn} {formatOrderDate(order.createdAt, locale)}
                    </p>
                  </div>
                  <span className={`account-page__status account-page__status--${order.status}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="account-page__order-items">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="account-page__order-item">
                      <div className="account-page__order-thumb">
                        <Image src={item.image} alt={item.name} fill sizes="56px" />
                      </div>
                      <div>
                        <p className="account-page__order-item-name">{item.name}</p>
                        <p className="account-page__order-item-meta">
                          {item.qty} × {item.price}
                        </p>
                      </div>
                      <span className="account-page__order-item-price">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="account-page__order-foot">
                  <div>
                    <p className="account-page__order-total-label">{o.total}</p>
                    <p className="account-page__order-total-value">€{order.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="account-page__order-actions">
                    <button
                      type="button"
                      className="account-page__order-link account-page__order-link--button"
                      disabled={downloadingId === order.id}
                      onClick={() => void handleDownloadReceipt(order)}
                    >
                      {downloadingId === order.id ? (
                        <Loader2 size={13} className="account-page__spinner" aria-hidden />
                      ) : (
                        <Download size={13} aria-hidden />
                      )}
                      {downloadingId === order.id ? o.receiptDownloading : o.downloadReceipt}
                    </button>
                    {(order.statusPageUrl ?? order.checkoutUrl) ? (
                      <a
                        href={order.statusPageUrl ?? order.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="account-page__order-link"
                      >
                        {o.viewCheckout}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default function OrdersContent() {
  return (
    <AccountGuard>
      <OrdersContentInner />
    </AccountGuard>
  );
}
