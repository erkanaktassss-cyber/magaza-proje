import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const modules = ['Satış', 'Ürünler', 'Stok', 'Müşteriler', 'Raporlar', 'Ayarlar'];
const quickActions = ['Yeni Satış', 'İade', 'Fiyat Sorgu', 'Kasayı Aç'];

const fallbackItems = [
  { id: 'f-1', name: 'Su 500ml', sale_price: 12.5, stock: 21 },
  { id: 'f-2', name: 'Kola 1L', sale_price: 39.9, stock: 8 },
  { id: 'f-3', name: 'Cips', sale_price: 27.5, stock: 5 },
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [dashboard, setDashboard] = useState({ todaySales: 0, criticalStock: [] });
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:4010/api/products')
      .then((r) => setProducts(r.data || []))
      .catch(() => setProducts([]));

    axios
      .get('http://localhost:4010/api/dashboard')
      .then((r) => setDashboard(r.data || { todaySales: 0, criticalStock: [] }))
      .catch(() => setDashboard({ todaySales: 0, criticalStock: [] }));
  }, []);

  const visibleProducts = useMemo(() => {
    const source = products.length ? products : fallbackItems;
    const q = query.trim().toLowerCase();
    if (!q) return source.slice(0, 8);
    return source.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [products, query]);

  const critical = dashboard.criticalStock?.length ? dashboard.criticalStock : fallbackItems;

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">FLOWIX</p>
              <h1 className="mt-1 text-3xl font-bold md:text-4xl">Premium POS Paneli</h1>
              <p className="mt-1 text-sm text-slate-400">Hızlı, modern ve yüksek kontrastlı satış deneyimi.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-right">
              <p className="text-xs uppercase tracking-widest text-emerald-200">Günlük Satış</p>
              <p className="text-2xl font-bold text-emerald-300">₺{dashboard.todaySales}</p>
            </div>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6">
          {modules.map((m) => (
            <button
              key={m}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium backdrop-blur transition hover:border-emerald-300/50 hover:bg-emerald-400/10"
            >
              {m}
            </button>
          ))}
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickActions.map((a) => (
            <button
              key={a}
              className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20"
            >
              {a}
            </button>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20">
            <h2 className="mb-4 text-2xl font-semibold">Hızlı Satış Ekranı</h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Barkod veya ürün ara"
              className="mb-4 w-full rounded-2xl border border-white/10 bg-slate-800/80 p-4 text-base outline-none ring-emerald-300/50 transition focus:ring"
            />

            <div className="grid gap-3 md:grid-cols-2">
              {visibleProducts.map((p) => (
                <button
                  key={p.id}
                  className="rounded-2xl border border-white/10 bg-slate-800/80 p-4 text-left transition hover:border-emerald-300/40 hover:bg-slate-700"
                >
                  <p className="font-semibold">{p.name}</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                    <span>Stok: {p.stock ?? '-'}</span>
                    <span className="text-base font-bold text-emerald-300">₺{p.sale_price}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-400">Nakit Tahsilat</button>
              <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-sky-950 transition hover:bg-sky-400">Kart Tahsilat</button>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20">
            <h2 className="mb-4 text-2xl font-semibold">Kritik Stok Uyarıları</h2>
            <div className="space-y-3">
              {critical.map((p) => (
                <div key={p.id} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3">
                  <p className="font-semibold text-amber-100">{p.name}</p>
                  <p className="text-sm text-amber-200/80">Kalan: {p.stock ?? 0}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
