import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import type { ShopifyReceiptOrder, ShopifyReceiptShop } from '@/app/lib/shopify/admin-client';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;

const COLORS = {
  charcoal: rgb(0.173, 0.141, 0.125),
  taupe: rgb(0.541, 0.435, 0.353),
  gold: rgb(0.722, 0.588, 0.431),
  line: rgb(0.91, 0.875, 0.831),
};

type PdfFonts = {
  regular: PDFFont;
  bold: PDFFont;
};

type FontBytes = {
  regular: Uint8Array;
  bold: Uint8Array;
};

let fontBytesPromise: Promise<FontBytes> | null = null;

async function loadFontBytes(): Promise<FontBytes> {
  const fontsDir = join(process.cwd(), 'app', 'lib', 'orders', 'fonts');
  const regularPath = join(fontsDir, 'DejaVuSans.ttf');
  const boldPath = join(fontsDir, 'DejaVuSans-Bold.ttf');

  try {
    return {
      regular: readFileSync(regularPath),
      bold: readFileSync(boldPath),
    };
  } catch {
    const regularUrl =
      'https://cdn.jsdelivr.net/gh/dejavu-fonts/dejavu-fonts@version_2_37/ttf/DejaVuSans.ttf';
    const boldUrl =
      'https://cdn.jsdelivr.net/gh/dejavu-fonts/dejavu-fonts@version_2_37/ttf/DejaVuSans-Bold.ttf';

    const [regularResponse, boldResponse] = await Promise.all([fetch(regularUrl), fetch(boldUrl)]);
    if (!regularResponse.ok || !boldResponse.ok) {
      throw new Error('Failed to load PDF fonts');
    }

    const [regularBytes, boldBytes] = await Promise.all([
      regularResponse.arrayBuffer(),
      boldResponse.arrayBuffer(),
    ]);

    return {
      regular: new Uint8Array(regularBytes),
      bold: new Uint8Array(boldBytes),
    };
  }
}

async function getPdfFonts(pdf: PDFDocument): Promise<PdfFonts> {
  if (!fontBytesPromise) {
    fontBytesPromise = loadFontBytes();
  }

  pdf.registerFontkit(fontkit);
  const bytes = await fontBytesPromise;
  const regular = await pdf.embedFont(bytes.regular);
  const bold = await pdf.embedFont(bytes.bold);
  return { regular, bold };
}

class PdfWriter {
  private pdf: PDFDocument;
  private page: PDFPage;
  private fonts: PdfFonts | null = null;
  private y = PAGE_HEIGHT - MARGIN;

  private constructor(pdf: PDFDocument, page: PDFPage) {
    this.pdf = pdf;
    this.page = page;
  }

  static async create() {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    const writer = new PdfWriter(pdf, page);
    writer.fonts = await getPdfFonts(pdf);
    return writer;
  }

  private ensureFonts(): PdfFonts {
    if (!this.fonts) throw new Error('PDF fonts not loaded');
    return this.fonts;
  }

  text(
    value: string,
    options: {
      size?: number;
      bold?: boolean;
      color?: ReturnType<typeof rgb>;
      x?: number;
      maxWidth?: number;
      lineHeight?: number;
    } = {},
  ) {
    const fonts = this.ensureFonts();
    const size = options.size ?? 10;
    const font = options.bold ? fonts.bold : fonts.regular;
    const x = options.x ?? MARGIN;
    const maxWidth = options.maxWidth ?? PAGE_WIDTH - MARGIN * 2;
    const lineHeight = options.lineHeight ?? size + 4;
    const lines = wrapText(value, font, size, maxWidth);

    for (const line of lines) {
      this.page.drawText(line, {
        x,
        y: this.y,
        size,
        font,
        color: options.color ?? COLORS.charcoal,
      });
      this.y -= lineHeight;
    }
  }

  gap(amount: number) {
    this.y -= amount;
  }

  rule() {
    const y = this.y + 6;
    this.page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1,
      color: COLORS.line,
    });
    this.y -= 14;
  }

  columns(values: Array<{ text: string; x: number; width?: number; bold?: boolean }>, size = 9) {
    const fonts = this.ensureFonts();
    const lineHeight = size + 5;
    let maxLines = 1;

    const wrapped = values.map((column) => {
      const font = column.bold ? fonts.bold : fonts.regular;
      const lines = wrapText(column.text, font, size, column.width ?? 120);
      maxLines = Math.max(maxLines, lines.length);
      return { ...column, lines, font };
    });

    for (let lineIndex = 0; lineIndex < maxLines; lineIndex += 1) {
      for (const column of wrapped) {
        const line = column.lines[lineIndex];
        if (!line) continue;
        this.page.drawText(line, {
          x: column.x,
          y: this.y - lineIndex * lineHeight,
          size,
          font: column.font,
          color: column.bold ? COLORS.taupe : COLORS.charcoal,
        });
      }
    }

    this.y -= maxLines * lineHeight;
  }

  rightText(value: string, size = 10, bold = false) {
    const fonts = this.ensureFonts();
    const font = bold ? fonts.bold : fonts.regular;
    const width = font.widthOfTextAtSize(value, size);
    this.page.drawText(value, {
      x: PAGE_WIDTH - MARGIN - width,
      y: this.y,
      size,
      font,
      color: COLORS.charcoal,
    });
    this.y -= size + 6;
  }

  async toBuffer() {
    return Buffer.from(await this.pdf.save());
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines: string[] = [];
  let current = words[0] ?? '';

  for (const word of words.slice(1)) {
    const candidate = `${current} ${word}`;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  lines.push(current);
  return lines;
}

export type ReceiptPdfLabels = {
  receiptTitle: string;
  orderNumber: string;
  placedOn: string;
  customer: string;
  billingAddress: string;
  status: string;
  items: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  shopifySourceNote: string;
  statusPage: string;
};

function formatMoney(money: { amount: string; currencyCode: string }) {
  const amount = Number.parseFloat(money.amount);
  const formatted = Number.isFinite(amount) ? amount.toFixed(2) : money.amount;
  return `${formatted} ${money.currencyCode}`;
}

function formatAddress(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(', ');
}

function formatDate(iso: string | null, locale: string) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export async function buildShopifyReceiptPdf(
  order: ShopifyReceiptOrder,
  shop: ShopifyReceiptShop,
  labels: ReceiptPdfLabels,
  locale: string,
): Promise<Buffer> {
  const writer = await PdfWriter.create();

  writer.text(shop.name, { size: 20, bold: true });

  const shopAddress = formatAddress([
    shop.billingAddress?.address1,
    shop.billingAddress?.address2,
    shop.billingAddress?.city,
    shop.billingAddress?.zip,
    shop.billingAddress?.country,
  ]);
  if (shopAddress) writer.text(shopAddress, { size: 9, color: COLORS.taupe });
  if (shop.contactEmail) writer.text(shop.contactEmail, { size: 9, color: COLORS.taupe });

  writer.gap(12);
  writer.text(labels.receiptTitle, { size: 16, bold: true });
  writer.gap(6);
  writer.text(`${labels.orderNumber}: ${order.name}`);
  writer.text(`${labels.placedOn}: ${formatDate(order.processedAt ?? order.createdAt, locale)}`);

  const customerName = order.billingAddress?.name ?? order.email ?? '—';
  writer.text(`${labels.customer}: ${customerName}`);
  if (order.email) writer.text(order.email);

  const billing = order.billingAddress
    ? formatAddress([
        order.billingAddress.address1,
        order.billingAddress.address2,
        order.billingAddress.city,
        order.billingAddress.zip,
        order.billingAddress.country,
      ])
    : '';
  if (billing) writer.text(`${labels.billingAddress}: ${billing}`);

  const statusParts = [order.displayFinancialStatus, order.displayFulfillmentStatus].filter(Boolean);
  if (statusParts.length) writer.text(`${labels.status}: ${statusParts.join(' · ')}`);

  writer.gap(10);
  writer.columns([
    { text: labels.items, x: MARGIN, width: 250, bold: true },
    { text: labels.quantity, x: 320, width: 50, bold: true },
    { text: labels.unitPrice, x: 390, width: 70, bold: true },
    { text: labels.lineTotal, x: 470, width: 80, bold: true },
  ]);
  writer.rule();

  for (const item of order.lineItems) {
    writer.columns([
      { text: item.name, x: MARGIN, width: 250 },
      { text: String(item.quantity), x: 320, width: 50 },
      { text: formatMoney(item.unitPrice), x: 390, width: 70 },
      { text: formatMoney(item.lineTotal), x: 470, width: 80 },
    ]);
  }

  writer.gap(8);
  writer.rightText(`${labels.subtotal}: ${formatMoney(order.subtotal)}`);
  writer.rightText(`${labels.shipping}: ${formatMoney(order.totalShipping)}`);

  for (const taxLine of order.taxLines) {
    const rate = taxLine.ratePercentage != null ? ` (${taxLine.ratePercentage}%)` : '';
    writer.rightText(`${taxLine.title}${rate}: ${formatMoney(taxLine.amount)}`);
  }

  writer.rightText(`${labels.total}: ${formatMoney(order.total)}`, 12, true);
  writer.gap(16);
  writer.text(labels.shopifySourceNote, { size: 8, color: COLORS.taupe, maxWidth: PAGE_WIDTH - MARGIN * 2 });

  if (order.statusPageUrl) {
    writer.gap(4);
    writer.text(`${labels.statusPage}: ${order.statusPageUrl}`, { size: 8, color: COLORS.gold });
  }

  return writer.toBuffer();
}

export type StoredReceiptPdfLabels = {
  brandName: string;
  receiptTitle: string;
  orderNumber: string;
  placedOn: string;
  customer: string;
  status: string;
  items: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
  total: string;
  sourceNote: string;
  statusPage: string;
};

type StoredReceiptOrder = {
  orderNumber: string;
  shopifyOrderName?: string;
  status: string;
  createdAt: string | null;
  items: Array<{ name: string; qty: number; price: string }>;
  subtotal: number;
  statusPageUrl?: string;
  checkoutUrl?: string;
};

export async function buildStoredOrderReceiptPdf(
  order: StoredReceiptOrder,
  customerName: string,
  customerEmail: string,
  labels: StoredReceiptPdfLabels,
  locale: string,
): Promise<Buffer> {
  const writer = await PdfWriter.create();

  writer.text(labels.brandName, { size: 20, bold: true });
  writer.gap(10);
  writer.text(labels.receiptTitle, { size: 16, bold: true });
  writer.gap(6);

  const displayOrderNumber = order.shopifyOrderName ?? order.orderNumber;
  writer.text(`${labels.orderNumber}: ${displayOrderNumber}`);
  writer.text(`${labels.placedOn}: ${formatDate(order.createdAt, locale)}`);
  writer.text(`${labels.customer}: ${customerName}`);
  writer.text(customerEmail);
  writer.text(`${labels.status}: ${order.status}`);

  writer.gap(10);
  writer.columns([
    { text: labels.items, x: MARGIN, width: 250, bold: true },
    { text: labels.quantity, x: 320, width: 50, bold: true },
    { text: labels.unitPrice, x: 390, width: 70, bold: true },
    { text: labels.lineTotal, x: 470, width: 80, bold: true },
  ]);
  writer.rule();

  for (const item of order.items) {
    writer.columns([
      { text: item.name, x: MARGIN, width: 250 },
      { text: String(item.qty), x: 320, width: 50 },
      { text: item.price, x: 390, width: 70 },
      { text: item.price, x: 470, width: 80 },
    ]);
  }

  writer.gap(8);
  writer.rightText(`${labels.total}: €${order.subtotal.toFixed(2)}`, 12, true);
  writer.gap(16);
  writer.text(labels.sourceNote, { size: 8, color: COLORS.taupe, maxWidth: PAGE_WIDTH - MARGIN * 2 });

  const statusUrl = order.statusPageUrl ?? order.checkoutUrl;
  if (statusUrl) {
    writer.gap(4);
    writer.text(`${labels.statusPage}: ${statusUrl}`, { size: 8, color: COLORS.gold });
  }

  return writer.toBuffer();
}
