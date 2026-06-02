'use client';

import { useMemo, useState } from 'react';
import { categories as initialCategories, demoOrders, formatPrice, products as initialProducts } from '../../lib/data';
import { Category, Order, Product } from '../../lib/types';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [draft, setDraft] = useState({ name: '', categoryId: initialCategories[0].id, price: 0, stock: 0 });
  const [coupon, setCoupon] = useState({ code: 'WELCOME10', discount: 10 });

  const stats = useMemo(() => ({
    totalSales: orders.reduce((sum, order) => sum + order.total, 0),
    pending: orders.filter((order) => order.status === 'Beklemede').length,
    lowStock: products.filter((product) => product.stock <= 20).length,
    bestSeller: products.find((product) => product.isBestSeller)?.name ?? '-'
  }), [orders, products]);

  const addProduct = () => {
    const category = categories.find((item) => item.id === draft.categoryId) ?? categories[0];
    const slug = draft.name.toLocaleLowerCase('tr-TR').replaceAll(' ', '-').replace(/[^a-z0-9ğüşöçıİ-]/gi, '').toLowerCase();
    setProducts((current) => [{ id: `p-${Date.now()}`, slug, name: draft.name || 'Yeni Ürün', categoryId: category.id, categoryName: category.name, price: Number(draft.price), stock: Number(draft.stock), imageTone: 'from-stone-950 via-amber-700 to-cream', description: 'Admin panelinden eklenen ürün.', variants: [{ type: 'adet', label: '1 adet', stock: Number(draft.stock) }] }, ...current]);
    setDraft({ name: '', categoryId: categories[0].id, price: 0, stock: 0 });
  };

  const changeStatus = (id: string, status: Order['status']) => setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
  const deleteProduct = (id: string) => setProducts((current) => current.filter((product) => product.id !== id));
  const reduceStock = (id: string) => setProducts((current) => current.map((product) => product.id === id ? { ...product, stock: Math.max(0, product.stock - 1) } : product));

  return (
    <main className="min-h-screen bg-cream py-10">
      <div className="luxe-container">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="section-eyebrow">Admin paneli</p><h1 className="mt-3 font-display text-6xl font-semibold">Dashboard</h1></div><span className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-ivory">Biolife Atelier Yönetim</span></div>
        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat label="Toplam satış" value={formatPrice(stats.totalSales)} /><Stat label="Bekleyen siparişler" value={String(stats.pending)} /><Stat label="Stok azalan ürünler" value={String(stats.lowStock)} /><Stat label="En çok satan" value={stats.bestSeller} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="luxe-card p-6"><h2 className="font-display text-3xl">Ürün ekleme formu</h2><div className="mt-5 grid gap-3"><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ürün adı" className="rounded-full border border-ink/10 px-5 py-3" /><select value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })} className="rounded-full border border-ink/10 px-5 py-3">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><input value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} type="number" placeholder="Fiyat" className="rounded-full border border-ink/10 px-5 py-3" /><input value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} type="number" placeholder="Stok" className="rounded-full border border-ink/10 px-5 py-3" /><button onClick={addProduct} className="gold-button">Ürün ekle</button></div></div>
          <div className="luxe-card p-6"><h2 className="font-display text-3xl">Kategori ekleme</h2><div className="mt-5 flex gap-3"><input id="new-category" placeholder="Kategori adı" className="flex-1 rounded-full border border-ink/10 px-5 py-3" /><button onClick={() => { const input = document.getElementById('new-category') as HTMLInputElement | null; if (input?.value) setCategories((current) => [...current, { id: input.value.toLowerCase().replaceAll(' ', '-'), name: input.value, type: 'supplies', description: 'Yeni kategori', imageTone: 'from-zinc-900 to-gold', featured: false }]); }} className="ghost-button">Ekle</button></div><h3 className="mt-7 font-semibold">Kupon / indirim oluşturma</h3><div className="mt-3 flex gap-3"><input value={coupon.code} onChange={(event) => setCoupon({ ...coupon, code: event.target.value })} className="rounded-full border border-ink/10 px-5 py-3" /><input value={coupon.discount} onChange={(event) => setCoupon({ ...coupon, discount: Number(event.target.value) })} type="number" className="w-28 rounded-full border border-ink/10 px-5 py-3" /></div><p className="mt-3 text-sm text-ink/55">Aktif kupon: %{coupon.discount} indirim - {coupon.code}</p></div>
        </section>

        <section className="mt-8 luxe-card overflow-hidden p-6"><h2 className="font-display text-3xl">Ürün yönetimi · düzenleme / silme / stok takibi</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-[.2em] text-gold"><tr><th className="py-3">Ürün</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th>İşlem</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t border-ink/10"><td className="py-3 font-semibold">{product.name}</td><td>{product.categoryName}</td><td>{formatPrice(product.discountedPrice ?? product.price)}</td><td>{product.stock}</td><td className="flex gap-2 py-2"><button onClick={() => reduceStock(product.id)} className="rounded-full border px-3 py-1">Stok -</button><button onClick={() => deleteProduct(product.id)} className="rounded-full bg-red-50 px-3 py-1 text-red-600">Sil</button></td></tr>)}</tbody></table></div></section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="luxe-card p-6"><h2 className="font-display text-3xl">Sipariş yönetimi</h2>{orders.map((order) => <div key={order.id} className="mt-4 rounded-2xl border border-ink/10 p-4"><div className="flex justify-between"><strong>{order.id} · {order.customer}</strong><span>{formatPrice(order.total)}</span></div><p className="mt-2 text-sm text-ink/55">Ödeme: {order.payment} {order.trackingCode ? `· Kargo: ${order.trackingCode}` : ''}</p><select value={order.status} onChange={(event) => changeStatus(order.id, event.target.value as Order['status'])} className="mt-3 rounded-full border border-ink/10 px-4 py-2"><option>Beklemede</option><option>Hazırlanıyor</option><option>Kargoda</option><option>Teslim Edildi</option></select></div>)}</div>
          <div className="luxe-card p-6"><h2 className="font-display text-3xl">Müşteri listesi</h2><div className="mt-4 grid gap-3 text-sm"><p>Elif A. · elif@example.com · 2 sipariş</p><p>Murat K. · murat@example.com · 1 sipariş</p><p>Atölye Nova · nova@example.com · B2B müşteri</p></div></div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="luxe-card p-5"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">{label}</p><p className="mt-3 text-2xl font-bold">{value}</p></div>; }
