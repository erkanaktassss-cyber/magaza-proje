import Link from 'next/link';
import { categories } from '../lib/data';
import { CartLink } from '../app/ui/cart-link';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-ivory/55 backdrop-blur-2xl">
      <div className="luxe-container flex h-20 items-center justify-between gap-5">
        <Link href="/" className="group leading-none text-ink">
          <span className="block font-display text-3xl tracking-[-.08em] md:text-4xl">Felicita</span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[.34em] text-gold sm:block">Fragrances</span>
        </Link>
        <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[.24em] text-ink/62 xl:flex">
          <Link href="/#signature" className="transition hover:text-gold">Collections</Link>
          {categories.slice(0, 4).map((category) => <Link key={category.id} href={`/category/${category.slug}`} className="transition hover:text-gold">{category.name}</Link>)}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/#whatsapp" className="hidden rounded-full border border-ink/10 bg-white/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.2em] text-ink/70 backdrop-blur transition hover:border-gold hover:text-gold md:inline-flex">Sipariş</Link>
          <CartLink />
        </div>
      </div>
      <div className="scrollbar-hide luxe-container flex gap-5 overflow-x-auto pb-3 text-[10px] font-semibold uppercase tracking-[.22em] text-ink/45 xl:hidden">
        {categories.slice(0, 5).map((category) => <Link key={category.id} href={`/category/${category.slug}`} className="shrink-0 transition hover:text-gold">{category.name}</Link>)}
      </div>
    </header>
  );
}
