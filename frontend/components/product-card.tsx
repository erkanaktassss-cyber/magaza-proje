'use client';

import Link from 'next/link';
import { formatPrice } from '../lib/data';
import { Product } from '../lib/types';
import { useStore } from './store-provider';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();

  return (
    <article className="group reveal flex h-full flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_24px_80px_rgba(23,18,15,.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_32px_100px_rgba(23,18,15,.18)]">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream">
        <img src={product.image} alt={product.name} loading={priority ? 'eager' : 'lazy'} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.22em] text-black backdrop-blur">{product.badge ?? product.categoryName}</div>
        <button type="button" onClick={(event) => { event.preventDefault(); toggleFavorite(product.id); }} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/35 bg-white/85 text-lg text-black backdrop-blur transition hover:bg-black hover:text-white" aria-label="Favoriye ekle">
          {isFavorite(product.id) ? '♥' : '♡'}
        </button>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[.28em] text-gold">{product.categoryName}</p>
        <Link href={`/products/${product.slug}`} className="mt-2 font-display text-2xl leading-tight text-ink transition group-hover:text-gold">{product.name}</Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">{product.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.notes.slice(0, 2).map((note) => <span key={note} className="rounded-full bg-cream px-3 py-1 text-[11px] text-ink/60">{note.replace('Üst nota: ', '').replace('Kalp: ', '')}</span>)}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {product.discountedPrice ? <p className="text-sm text-ink/35 line-through">{formatPrice(product.price)}</p> : null}
            <p className="font-display text-2xl text-ink">{formatPrice(product.discountedPrice ?? product.price)}</p>
          </div>
          <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink/55">{product.stock} stok</span>
        </div>
        <button onClick={() => addToCart(product, product.variants[0]?.label)} className="mt-5 rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[.2em] text-white transition hover:bg-gold">Sepete ekle</button>
      </div>
    </article>
  );
}
