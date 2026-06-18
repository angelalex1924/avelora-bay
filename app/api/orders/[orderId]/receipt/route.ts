import { NextResponse } from 'next/server';
import { verifyFirebaseIdTokenWithApiKey } from '@/app/lib/firebase/verify-id-token';
import { buildShopifyReceiptPdf, buildStoredOrderReceiptPdf } from '@/app/lib/orders/receipt-pdf';
import type { OrderRecord } from '@/app/lib/orders/order-types';
import { fetchShopifyOrderReceipt } from '@/app/lib/shopify/admin-client';
import { isShopifyAdminConfigured } from '@/app/lib/shopify/admin-config';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

const RECEIPT_LABELS = {
  en: {
    brandName: 'Avelora Bay',
    receiptTitle: 'Order receipt',
    orderNumber: 'Order',
    placedOn: 'Date',
    customer: 'Customer',
    billingAddress: 'Billing address',
    status: 'Status',
    items: 'Item',
    quantity: 'Qty',
    unitPrice: 'Unit',
    lineTotal: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    total: 'Total',
    shopifySourceNote:
      'Official receipt generated from Shopify order data (Admin API). Tax amounts and line items match your Shopify store records.',
    storedSourceNote:
      'Receipt generated from your Avelora Bay order record. After Shopify payment sync, tax lines from Shopify will appear automatically.',
    statusPage: 'Order status',
  },
  el: {
    brandName: 'Avelora Bay',
    receiptTitle: 'Απόδειξη παραγγελίας',
    orderNumber: 'Παραγγελία',
    placedOn: 'Ημερομηνία',
    customer: 'Πελάτης',
    billingAddress: 'Διεύθυνση χρέωσης',
    status: 'Κατάσταση',
    items: 'Προϊόν',
    quantity: 'Ποσ.',
    unitPrice: 'Τιμή',
    lineTotal: 'Σύνολο',
    subtotal: 'Υποσύνολο',
    shipping: 'Μεταφορικά',
    tax: 'Φόρος',
    total: 'Σύνολο',
    shopifySourceNote:
      'Επίσημη απόδειξη από δεδομένα παραγγελίας Shopify (Admin API). Τα ποσά φόρου και τα είδη ταιριάζουν με τα αρχεία του καταστήματός σας.',
    storedSourceNote:
      'Απόδειξη από το αρχείο παραγγελίας Avelora Bay. Μετά τον συγχρονισμό πληρωμής Shopify, τα φορολογικά στοιχεία ενημερώνονται αυτόματα.',
    statusPage: 'Κατάσταση παραγγελίας',
  },
  de: {
    brandName: 'Avelora Bay',
    receiptTitle: 'Bestellbeleg',
    orderNumber: 'Bestellung',
    placedOn: 'Datum',
    customer: 'Kunde',
    billingAddress: 'Rechnungsadresse',
    status: 'Status',
    items: 'Artikel',
    quantity: 'Menge',
    unitPrice: 'Preis',
    lineTotal: 'Summe',
    subtotal: 'Zwischensumme',
    shipping: 'Versand',
    tax: 'Steuer',
    total: 'Gesamt',
    shopifySourceNote:
      'Offizieller Beleg aus Shopify-Bestelldaten (Admin API). Steuerbeträge und Positionen entsprechen Ihren Shopify-Shopdaten.',
    storedSourceNote:
      'Beleg aus Ihrem Avelora-Bay-Bestellarchiv. Nach Shopify-Zahlungssync werden Steuerzeilen automatisch ergänzt.',
    statusPage: 'Bestellstatus',
  },
} as const;

function resolveLocale(value: string | null) {
  if (value === 'gr' || value === 'el') return 'el';
  if (value === 'de') return 'de';
  return 'en';
}

function toIsoDate(value: Date | string | null | undefined) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

async function handleReceipt(req: Request, context: RouteContext) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized', code: 'auth_missing' }, { status: 401 });
  }

  const { email } = await verifyFirebaseIdTokenWithApiKey(token);
  const { orderId } = await context.params;
  const locale = resolveLocale(req.headers.get('x-avelora-locale'));
  const labels = RECEIPT_LABELS[locale === 'el' ? 'el' : locale === 'de' ? 'de' : 'en'];

  let order: OrderRecord | null = null;
  if (req.method === 'POST') {
    const body = (await req.json()) as { order?: OrderRecord };
    if (body.order?.id === orderId) {
      order = {
        ...body.order,
        createdAt: body.order.createdAt ? new Date(body.order.createdAt) : null,
      };
    }
  }

  if (!order) {
    return NextResponse.json({ error: 'Order not found', code: 'not_found' }, { status: 404 });
  }

  if (order.shopifyOrderId && isShopifyAdminConfigured()) {
    try {
      const receipt = await fetchShopifyOrderReceipt(order.shopifyOrderId);
      if (receipt) {
        const pdfBuffer = await buildShopifyReceiptPdf(receipt.order, receipt.shop, labels, locale);
        const fileName = `shopify-receipt-${receipt.order.name.replace('#', '')}.pdf`;
        return new NextResponse(new Uint8Array(pdfBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Cache-Control': 'no-store',
          },
        });
      }
    } catch (shopifyError) {
      console.error('[orders/receipt] Shopify fallback:', shopifyError);
    }
  }

  const customerName = email ?? 'Customer';
  const pdfBuffer = await buildStoredOrderReceiptPdf(
    {
      orderNumber: order.orderNumber,
      shopifyOrderName: order.shopifyOrderName,
      status: order.status,
      createdAt: toIsoDate(order.createdAt),
      items: order.items.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      subtotal: order.subtotal,
      statusPageUrl: order.statusPageUrl,
      checkoutUrl: order.checkoutUrl,
    },
    customerName,
    email ?? '',
    {
      brandName: labels.brandName,
      receiptTitle: labels.receiptTitle,
      orderNumber: labels.orderNumber,
      placedOn: labels.placedOn,
      customer: labels.customer,
      status: labels.status,
      items: labels.items,
      quantity: labels.quantity,
      unitPrice: labels.unitPrice,
      lineTotal: labels.lineTotal,
      total: labels.total,
      sourceNote: labels.storedSourceNote,
      statusPage: labels.statusPage,
    },
    locale,
  );

  const fileName = `avelora-receipt-${order.shopifyOrderName?.replace('#', '') ?? order.orderNumber}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(req: Request, context: RouteContext) {
  try {
    return await handleReceipt(req, context);
  } catch (error) {
    return receiptErrorResponse(error);
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    return await handleReceipt(req, context);
  } catch (error) {
    return receiptErrorResponse(error);
  }
}

function receiptErrorResponse(error: unknown) {
  console.error('[orders/receipt]', error);
  const message = error instanceof Error ? error.message : 'Failed to generate receipt';
  const status = message === 'Forbidden' ? 403 : message.includes('Invalid Firebase') ? 401 : 500;
  return NextResponse.json(
    {
      error: message,
      code: status === 403 ? 'forbidden' : status === 401 ? 'auth_invalid' : 'failed',
    },
    { status },
  );
}
