import Link from 'next/link';
import { categories, whatsappNumber } from '../lib/data';

export function Footer() {
  return (
    <footer className="overflow-hidden bg-obsidian pt-16 text-ivory">
      <div className="mb-12 flex whitespace-nowrap text-7xl text-white/10 md:text-9xl">
        <div className="marquee font-display">Felicita Fragrances · Ritual Storefront · Premium Care · Luxury Catalogue · Felicita Fragrances · Ritual Storefront · Premium Care · Luxury Catalogue · </div>
      </div>
      <div className="luxe-container grid gap-10 border-t border-white/10 py-12 md:grid-cols-[1.3fr_.7fr_.7fr]">
        <div>
          <p className="font-display text-5xl leading-none">Felicita Fragrances</p>
          <p className="mt-5 max-w-md text-sm leading-7 text-ivory/58">Backend, admin ve veritabanı olmadan; JSON demo ürünlerle çalışan, lüks katalog/e-ticaret vitrini olarak tasarlanmış Next.js frontend.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-gold">Koleksiyon</p>
          <div className="mt-5 grid gap-3 text-sm text-ivory/62">
            {categories.slice(0, 5).map((category) => <Link key={category.id} href={`/category/${category.slug}`} className="transition hover:text-gold">{category.name}</Link>)}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-gold">Sipariş</p>
          <p className="mt-5 text-sm leading-7 text-ivory/62">WhatsApp üzerinden demo sipariş akışı: +{whatsappNumber}. Sepet istemci tarafında basit tutuldu.</p>
        </div>
      </div>
    </footer>
  );
}
