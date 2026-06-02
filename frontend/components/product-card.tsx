'use client';

import Link from 'next/link';
import { formatPrice, whatsappNumber } from '../lib/data';
import { Product } from '../lib/types';
import { useStore } from './store-provider';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const askText = encodeURIComponent(`${product.name} hakkında bilgi almak istiyorum.`);

  return (
    <article className="group luxe-card flex h-full flex-col overflow-hidden p-3">
      <Link href={`/products/${product.slug}`} className={`product-art flex aspect-[4/5] items-end bg-gradient-to-br ${product.imageTone} p-5`}>
        <div className="relative z-10 rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-ink shadow">{product.badge ?? product.categoryName}</div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">{product.categoryName}</p>
            <Link href={`/products/${product.slug}`} className="mt-2 block font-display text-2xl font-semibold leading-tight text-ink transition group-hover:text-gold">{product.name}</Link>
          </div>
          <button aria-label="Favoriye ekle" onClick={() => toggleFavorite(product.id)} className="rounded-full border border-ink/10 px-3 py-2 text-lg transition hover:border-gold">{isFavorite(product.id) ? '♥' : '♡'}</button>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">{product.description}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            {product.discountedPrice && <p className="text-sm text-ink/35 line-through">{formatPrice(product.price)}</p>}
            <p className="text-xl font-bold text-ink">{formatPrice(product.discountedPrice ?? product.price)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${product.stock > 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{product.stock > 0 ? `Stok: ${product.stock}` : 'Tükendi'}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={() => addToCart(product, product.variants[0]?.label)} className="gold-button px-3 py-3 text-[11px]">Sepete ekle</button>
          <a href={`https://wa.me/${whatsappNumber}?text=${askText}`} className="ghost-button px-3 py-3 text-center text-[11px]">WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
