'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/app/lib/cn';
import { useCart } from '@/app/lib/cart/cart-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';
import { useTranslations } from '@/app/lib/i18n/locale-context';

export type ProductCardData = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  href: string;
  badge?: string | null;
  variantId?: string;
  availableForSale?: boolean;
};

type ProductCardProps = {
  product: ProductCardData;
};

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const { addItem } = useCart();
  const isSoldOut = product.availableForSale === false;

  function handleQuickAdd() {
    if (isSoldOut) return;

    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      variantId: product.variantId,
    });
  }

  return (
    <article className={cn('product-card', isSoldOut && 'is-sold-out')}>
      <Link href={lp(product.href)} className="product-card__link">
        <div className="product-card__frame">
          <div className="product-card__media">
            {isSoldOut ? (
              <span className="product-card__badge product-card__badge--sold-out">{t.common.soldOut}</span>
            ) : product.badge ? (
              <span className="product-card__badge">{product.badge}</span>
            ) : null}
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn('product-card__img', isSoldOut && 'product-card__img--sold-out')}
            />
          </div>
        </div>
        <div className="product-card__body">
          <span className="product-card__category">{product.category}</span>
          <h3 className="product-card__title">{product.name}</h3>
        </div>
      </Link>

      <div className="product-card__meta">
        <span className="product-card__price">{product.price}</span>
        <button
          type="button"
          className="product-card__quick-add"
          disabled={isSoldOut}
          onClick={handleQuickAdd}
        >
          {isSoldOut ? t.common.soldOut : t.common.quickAdd}
        </button>
      </div>
    </article>
  );
}
