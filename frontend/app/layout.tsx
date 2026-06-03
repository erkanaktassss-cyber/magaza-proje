import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { StoreProvider } from '../components/store-provider';
import { categories } from '../lib/data';
import { CartLink } from './ui/cart-link';

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
          <header className="sticky top-0 z-50 border-b border-black/10 bg-ivory/90 backdrop-blur-2xl">
            <div className="luxe-container flex h-20 items-center justify-between gap-5">
              <Link href="/" className="font-display text-2xl text-ink md:text-3xl">Felicita</Link>
              <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[.22em] text-ink/60 xl:flex">
                {categories.slice(0, 5).map((category) => <Link key={category.id} href={`/category/${category.slug}`} className="transition hover:text-gold">{category.name}</Link>)}
              </nav>
              <div className="flex items-center gap-3">
                <Link href="/products" className="hidden rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] transition hover:border-gold hover:text-gold sm:inline-flex">Katalog</Link>
                <CartLink />
              </div>
            </div>
          </header>
          {children}
          <footer className="overflow-hidden bg-obsidian py-14 text-ivory">
            <div className="mb-10 flex whitespace-nowrap text-6xl text-white/10 md:text-8xl"><div className="marquee font-display">Felicita Fragrances · Ritual Storefront · Premium Care · Luxury Demo · Felicita Fragrances · Ritual Storefront · Premium Care · Luxury Demo · </div></div>
            <div className="luxe-container grid gap-10 md:grid-cols-[1.3fr_.7fr_.7fr]">
              <div>
                <p className="font-display text-4xl">Felicita Fragrances</p>
                <p className="mt-4 max-w-md text-sm leading-7 text-ivory/60">Backend öncesi yatırımcı demosu için tasarlanmış, JSON katalogla çalışan premium Next.js 15 frontend.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.26em] text-gold">Kategoriler</p>
                <div className="mt-4 grid gap-2 text-sm text-ivory/65">{categories.slice(0, 4).map((category) => <Link key={category.id} href={`/category/${category.slug}`}>{category.name}</Link>)}</div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.26em] text-gold">Demo</p>
                <p className="mt-4 text-sm leading-7 text-ivory/65">Veritabanı yok. Sepet istemci tarafında çalışır. Ürün görselleri Unsplash kaynaklıdır.</p>
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
