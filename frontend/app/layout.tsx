import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../components/store-provider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Felicita Fragrances | Premium Ritual Storefront',
    template: '%s | Felicita Fragrances'
  },
  description: 'Parfüm, esans, doğal sabun, doğal krem, aromaterapi, mum, kalıp ve ambalaj kategorileri için premium Next.js demo mağaza.',
  openGraph: {
    title: 'Felicita Fragrances',
    description: 'Yatırımcı ve müşteri demosu için lüks, mobil uyumlu frontend mağaza deneyimi.',
    locale: 'tr_TR',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <StoreProvider>
          <Header />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
