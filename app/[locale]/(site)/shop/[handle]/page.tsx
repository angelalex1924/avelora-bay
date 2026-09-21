import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShopProductByHandle } from '@/app/lib/shopify/products';
import { resolveLocale } from '@/app/lib/i18n/resolve-locale';
import ProductDetailContent from '@/app/components/product-detail-content';

export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const locale = await resolveLocale();
  const product = await getShopProductByHandle(handle, locale);

  if (!product) {
    return {
      title: 'Προϊόν δεν βρέθηκε — Avelora Bay',
    };
  }

  return {
    title: `${product.name} — Avelora Bay`,
    description: product.description || product.category,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const locale = await resolveLocale();
  const product = await getShopProductByHandle(handle, locale);

  if (!product) {
    notFound();
  }

  return <ProductDetailContent product={product} />;
}
