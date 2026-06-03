'use client';

import { useMemo, useState } from 'react';
import { categories, products } from '../lib/data';
import { ProductCard } from './product-card';

export function ProductExplorer({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('featured');

  const filtered = useMemo(() => {
    const list = products.filter((product) => {
      const haystack = `${product.name} ${product.categoryName} ${product.description} ${product.notes.join(' ')}`.toLocaleLowerCase('tr-TR');
      const matchesQuery = haystack.includes(query.toLocaleLowerCase('tr-TR'));
      const matchesCategory = category === 'all' || product.categoryId === category;
      return matchesQuery && matchesCategory;
    });
    if (sort === 'price-asc') return [...list].sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
    if (sort === 'price-desc') return [...list].sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
    return [...list].sort((a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)) || Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
  }, [category, query, sort]);

  return (
    <section className="luxe-container py-12">
      <div className="sticky top-24 z-20 mb-10 grid gap-3 rounded-[1.75rem] border border-black/10 bg-ivory/90 p-3 shadow-luxe backdrop-blur-xl md:grid-cols-[1.4fr_1fr_1fr]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürün, nota veya ritüel ara" className="rounded-full border border-black/10 bg-white px-5 py-4 text-sm outline-none transition focus:border-gold" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-full border border-black/10 bg-white px-5 py-4 text-sm outline-none transition focus:border-gold">
          <option value="all">Tüm kategoriler</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-black/10 bg-white px-5 py-4 text-sm outline-none transition focus:border-gold">
          <option value="featured">Editör seçimi</option>
          <option value="price-asc">Fiyat artan</option>
          <option value="price-desc">Fiyat azalan</option>
        </select>
      </div>
      <div className="mb-6 flex items-center justify-between text-sm text-ink/55"><span>{filtered.length} ürün gösteriliyor</span><span>JSON katalog · veritabanı yok</span></div>
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}
      </div>
    </section>
  );
}
