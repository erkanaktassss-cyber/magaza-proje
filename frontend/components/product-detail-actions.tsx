'use client';

import { useState } from 'react';
import { Product } from '../lib/types';
import { useStore } from './store-provider';

export function ProductDetailActions({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[0]?.label ?? 'Standart');
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <select value={variant} onChange={(event) => setVariant(event.target.value)} className="rounded-full border border-ink/10 bg-white px-5 py-3 outline-none focus:border-gold">
        {product.variants.map((item) => <option key={`${item.type}-${item.label}`} value={item.label}>{item.label}</option>)}
      </select>
      <button onClick={() => addToCart(product, variant)} className="gold-button">Sepete ekle</button>
      <button onClick={() => toggleFavorite(product.id)} className="ghost-button">{isFavorite(product.id) ? 'Favoriden çıkar' : 'Favoriye ekle'}</button>
    </div>
  );
}
