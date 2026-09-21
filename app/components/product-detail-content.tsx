'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/lib/cart/cart-context';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import type { ShopProduct } from '@/app/lib/products/types';
import { Check, ShieldCheck, Truck, ArrowLeft, ShoppingBag, Zap } from 'lucide-react';
import '@/app/styles/shop.css';
import '@/app/styles/product-detail.css';

type ProductDetailContentProps = {
  product: ShopProduct;
};

export default function ProductDetailContent({ product }: ProductDetailContentProps) {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const { addItem } = useCart();
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const isSoldOut = product.availableForSale === false;

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addItem({
      id: String(product.id),
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      variantId: product.variantId,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = async () => {
    if (isSoldOut || !product.variantId) return;
    setBuyingNow(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ variantId: product.variantId, quantity: qty }],
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push(lp('/checkout'));
      }
    } catch {
      router.push(lp('/checkout'));
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <div className="product-detail-page" data-nav-theme="light">
      <div className="container">
        {/* Breadcrumb navigation */}
        <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href={lp('/')} className="breadcrumb-link">
            {t.common.home}
          </Link>
          <span className="breadcrumb-sep">/</span>
          <Link href={lp('/shop')} className="breadcrumb-link">
            {t.shop.title}
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail__grid">
          {/* Product Media */}
          <div className="product-detail__media-wrapper">
            <div className="product-detail__media">
              {product.badge ? (
                <span className="product-detail__badge">{product.badge}</span>
              ) : null}
              {isSoldOut ? (
                <span className="product-detail__badge product-detail__badge--soldout">
                  {t.common.soldOut}
                </span>
              ) : null}
              <Image
                src={product.image || '/hero-back.jpg'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 600px"
                className="product-detail__img"
              />
            </div>
          </div>

          {/* Product Info & Actions */}
          <div className="product-detail__info">
            <div className="product-detail__header">
              <span className="product-detail__category">{product.category}</span>
              <h1 className="product-detail__title">{product.name}</h1>
              <div className="product-detail__price-row">
                <span className="product-detail__price">{product.price}</span>
                <span className="product-detail__stock">
                  {isSoldOut ? (
                    <span className="stock-tag out">{t.common.soldOut}</span>
                  ) : (
                    <span className="stock-tag in">
                      <Check size={14} /> Σε απόθεμα
                    </span>
                  )}
                </span>
              </div>
            </div>

            {product.description ? (
              <div className="product-detail__description">
                <p>{product.description}</p>
              </div>
            ) : null}

            {/* Quantity and Actions */}
            {!isSoldOut ? (
              <div className="product-detail__actions">
                <div className="product-detail__qty-box">
                  <span className="qty-label">Ποσότητα:</span>
                  <div className="qty-controls">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="qty-value">{qty}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="product-detail__buttons">
                  <button
                    type="button"
                    className="btn btn-add-cart"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag size={18} />
                    {added ? 'Προστέθηκε στο Καλάθι ✓' : 'Προσθήκη στο Καλάθι'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-buy-now"
                    onClick={handleBuyNow}
                    disabled={buyingNow}
                  >
                    <Zap size={18} />
                    {buyingNow ? 'Μετάβαση στο Ταμείο...' : 'Άμεση Αγορά (Checkout)'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="product-detail__soldout-box">
                <p>Το προϊόν είναι προσωρινά εξαντλημένο.</p>
              </div>
            )}

            {/* Value Guarantees */}
            <div className="product-detail__perks">
              <div className="perk-item">
                <Truck className="perk-icon" size={20} />
                <div>
                  <strong>Δωρεάν Αποστολή</strong>
                  <p>Σε όλες τις παραγγελίες άνω των 50€</p>
                </div>
              </div>
              <div className="perk-item">
                <ShieldCheck className="perk-icon" size={20} />
                <div>
                  <strong>Ασφαλές Checkout</strong>
                  <p>Επίσημη πληρωμή μέσω του συστήματος Shopify</p>
                </div>
              </div>
            </div>

            <div className="product-detail__back">
              <Link href={lp('/shop')} className="back-link">
                <ArrowLeft size={16} />
                Επιστροφή σε όλα τα προϊόντα
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
