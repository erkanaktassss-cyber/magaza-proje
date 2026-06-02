'use client';

import { useMemo, useState } from 'react';
import { categories, products } from '../lib/data';
import { ProductCard } from './product-card';

export function ProductExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [stock, setStock] = useState('all');
  const [sort, setSort] = useState('featured');

  const filtered = useMemo(() => {
    const list = products.filter((product) => {
      const matchesQuery = `${product.name} ${product.categoryName} ${product.description}`.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR'));
      const matchesCategory = category === 'all' || product.categoryId === category;
      const matchesStock = stock === 'all' || (stock === 'in' ? product.stock > 0 : product.stock <= 20);
      return matchesQuery && matchesCategory && matchesStock;
    });
    if (sort === 'price-asc') return [...list].sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
    if (sort === 'price-desc') return [...list].sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
    return [...list].sort((a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)));
  }, [category, query, sort, stock]);

  return (
    <section className="luxe-container py-12">
      <div className="luxe-card mb-8 grid gap-4 p-4 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürün, kategori veya nota ara" className="rounded-full border border-ink/10 bg-white px-5 py-3 outline-none focus:border-gold" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-full border border-ink/10 bg-white px-5 py-3 outline-none focus:border-gold">
          <option value="all">Tüm kategoriler</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select value={stock} onChange={(event) => setStock(event.target.value)} className="rounded-full border border-ink/10 bg-white px-5 py-3 outline-none focus:border-gold">
          <option value="all">Tüm stoklar</option><option value="in">Stokta var</option><option value="low">Stok azalan</option>
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-ink/10 bg-white px-5 py-3 outline-none focus:border-gold">
          <option value="featured">Öne çıkan</option><option value="price-asc">Fiyat artan</option><option value="price-desc">Fiyat azalan</option>
        </select>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
