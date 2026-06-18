import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { aveloraBrand } from '@/app/lib/avelora-brand';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: aveloraBrand.gold,
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: 'Avelora Bay',
  description: 'Coastal beauty and lifestyle — discover curated products inspired by the sea.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Avelora Bay',
    statusBarStyle: 'default',
  },
  other: {
    'msapplication-TileColor': aveloraBrand.gold,
    'msapplication-TileImage': '/icons/icon-512.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
