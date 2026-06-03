'use client';

import { useState } from 'react';
import { Product } from '../lib/types';
import { useStore } from './store-provider';

export function ProductDetailActions({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[0]?.label ?? 'Standart');
  const { addToCart, toggleFavorite, isFavorite } = useStore();

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
      <select value={variant} onChange={(event) => setVariant(event.target.value)} className="rounded-full border border-black/10 bg-white px-5 py-4 outline-none transition focus:border-gold">
        {product.variants.map((item) => <option key={`${item.type}-${item.label}`} value={item.label}>{item.label}{item.priceDelta ? ` (+${item.priceDelta} TL)` : ''}</option>)}
      </select>
      <button onClick={() => addToCart(product, variant)} className="rounded-full bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[.22em] text-white transition hover:bg-gold">Sepete ekle</button>
      <button onClick={() => toggleFavorite(product.id)} className="rounded-full border border-black/15 px-8 py-4 text-xs font-semibold uppercase tracking-[.22em] transition hover:border-gold hover:text-gold">{isFavorite(product.id) ? 'Favoride' : 'Favori'}</button>
    </div>
  );
}
