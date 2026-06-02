import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { StoreProvider } from '../components/store-provider';

export const metadata: Metadata = {
  title: {
    default: 'Biolife Atelier | Premium Doğal Ürünler ve Atölye Mağazası',
    template: '%s | Biolife Atelier'
  },
  description: 'Parfüm, parfüm esansı, doğal sabun, bakım ürünleri, aromaterapi, mum, epoksi hediyelik ve üretim ekipmanları için premium e-ticaret mağazası.',
  keywords: ['Biolife Atelier', 'parfüm', 'doğal sabun', 'parfüm esansı', 'aromaterapi', 'epoksi kalıp', 'üretim malzemeleri'],
  openGraph: {
    title: 'Biolife Atelier',
    description: 'Doğal, kalıcı ve özel ürünler için çok kategorili premium mağaza.',
    locale: 'tr_TR',
    type: 'website'
  }
};

const navItems = [
  { href: '/#categories', label: 'Kategoriler' },
  { href: '/products', label: 'Ürünler' },
  { href: '/#story', label: 'Hikaye' },
  { href: '/tracking', label: 'Kargo Takip' },
  { href: '/admin', label: 'Admin' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <StoreProvider>
          <header className="sticky top-0 z-50 border-b border-amber-950/10 bg-ivory/90 backdrop-blur-xl">
            <div className="luxe-container flex h-20 items-center justify-between gap-6">
              <Link href="/" className="font-display text-2xl font-semibold tracking-[0.16em] text-ink">Biolife Atelier</Link>
              <nav className="hidden items-center gap-7 text-sm font-medium text-ink/70 lg:flex">
                {navItems.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-gold">{item.label}</Link>)}
              </nav>
              <div className="flex items-center gap-3">
                <Link href="/account" className="hidden rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-gold hover:text-ink sm:inline-flex">Üyelik</Link>
                <Link href="/cart" className="gold-button px-4 py-2">Sepet</Link>
              </div>
            </div>
          </header>
          {children}
          <footer className="border-t border-amber-950/10 bg-obsidian py-12 text-ivory">
            <div className="luxe-container grid gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
              <div><p className="font-display text-3xl">Biolife Atelier</p><p className="mt-3 max-w-md text-sm leading-7 text-ivory/65">Premium parfüm, doğal bakım ve üretim malzemeleri için ölçeklenebilir e-ticaret altyapısı.</p></div>
              <div><p className="font-semibold">Ödeme</p><p className="mt-3 text-sm text-ivory/65">Kapıda ödeme, havale/EFT ve online ödeme entegrasyonuna hazır modüler yapı.</p></div>
              <div><p className="font-semibold">Hızlı Sipariş</p><a className="mt-3 inline-flex text-sm text-gold" href="https://wa.me/905551112233">WhatsApp ile iletişime geç</a></div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
