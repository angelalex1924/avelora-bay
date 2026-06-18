import Script from 'next/script';
import HomeContent from '@/app/components/home-content';
import '@/app/styles/home.css';

export default function Home() {
  return (
    <>
      <Script src="/scripts/hero-carousel-boot.js" strategy="afterInteractive" />
      <main className="home-page flex-1">
        <HomeContent />
      </main>
    </>
  );
}
