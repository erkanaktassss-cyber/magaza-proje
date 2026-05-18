import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const navItems = ['Dashboard', 'Satış', 'Siparişler', 'Stok', 'Müşteriler', 'Raporlar'];
const filterTags = ['Çok Satanlar', 'Yeni Ürünler', 'İçecek', 'Atıştırmalık', 'Temel Gıda'];

const fallbackItems = [
  { id: 'f-1', name: 'Su 500ml', sale_price: 12.5, stock: 21, category: 'İçecek' },
  { id: 'f-2', name: 'Kola 1L', sale_price: 39.9, stock: 8, category: 'İçecek' },
  { id: 'f-3', name: 'Cips', sale_price: 27.5, stock: 5, category: 'Atıştırmalık' },
  { id: 'f-4', name: 'Kraker', sale_price: 17.5, stock: 14, category: 'Atıştırmalık' },
  { id: 'f-5', name: 'Makarna', sale_price: 32, stock: 11, category: 'Temel Gıda' },
  { id: 'f-6', name: 'Ayran 300ml', sale_price: 16.9, stock: 9, category: 'İçecek' },
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

  const sourceProducts = products.length ? products : fallbackItems;

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sourceProducts.slice(0, 10);
    return sourceProducts.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 10);
  }, [sourceProducts, query]);

  const cartItems = useMemo(() => visibleProducts.slice(0, 3), [visibleProducts]);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + Number(item.sale_price || 0), 0),
    [cartItems],
  );

  const vat = subtotal * 0.2;
  const grandTotal = subtotal + vat;

  const critical = dashboard.criticalStock?.length ? dashboard.criticalStock : fallbackItems.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#070b14] bg-[radial-gradient(circle_at_top,_#1f2f63_0%,_#070b14_50%)] p-4 text-slate-100 md:p-6">
      <div className="mx-auto grid max-w-[1700px] gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-[#0c1222]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-violet-300/80">Flowix POS</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">Control Hub</h1>
            <p className="mt-2 text-sm text-slate-400">Premium touchscreen satış deneyimi</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                  index === 1
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-900/50'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="text-xs uppercase tracking-wider text-cyan-200/80">Terminal</p>
            <p className="mt-2 text-2xl font-bold">#POS-07</p>
            <p className="mt-1 text-sm text-cyan-100/80">Aktif kasiyer: Zeynep K.</p>
          </div>
        </aside>

        <main className="space-y-4">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-[#0d152a]/90 p-5 shadow-xl transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-widest text-slate-400">Bugünkü Satış</p>
              <p className="mt-3 text-3xl font-extrabold text-emerald-300">₺{dashboard.todaySales || 0}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0d152a]/90 p-5 shadow-xl transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-widest text-slate-400">Ürün Sayısı</p>
              <p className="mt-3 text-3xl font-extrabold text-cyan-300">{sourceProducts.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0d152a]/90 p-5 shadow-xl transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-widest text-slate-400">Kritik Stok</p>
              <p className="mt-3 text-3xl font-extrabold text-amber-300">{critical.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0d152a]/90 p-5 shadow-xl transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-widest text-slate-400">Açık Sepetler</p>
              <p className="mt-3 text-3xl font-extrabold text-fuchsia-300">6</p>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-[#0b1428]/90 p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">Satış Paneli</h2>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-emerald-950 transition hover:scale-105 hover:bg-emerald-400">
                    Nakit Tahsilat
                  </button>
                  <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-sky-950 transition hover:scale-105 hover:bg-sky-400">
                    Kart Tahsilat
                  </button>
                </div>
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Barkod / Ürün ara"
                className="mt-4 w-full rounded-2xl border border-white/10 bg-[#101a34] p-4 text-base outline-none ring-violet-300/50 transition focus:ring"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {filterTags.map((tag) => (
                  <button
                    key={tag}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-violet-300/50 hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((p) => (
                  <button
                    key={p.id}
                    className="group rounded-2xl border border-white/10 bg-[#121d38]/90 p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:border-violet-300/60 hover:shadow-lg hover:shadow-violet-900/30"
                  >
                    <p className="truncate text-sm font-bold text-white">{p.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{p.category || 'Genel'}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                      <span>Stok: {p.stock ?? '-'}</span>
                      <span className="text-base font-extrabold text-emerald-300 group-hover:text-emerald-200">₺{p.sale_price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0b1428]/90 p-5 shadow-2xl">
                <h3 className="text-xl font-bold">Cart / Aktif Fiş</h3>
                <div className="mt-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-sm font-extrabold text-emerald-300">₺{item.sale_price}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">1 adet</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex items-center justify-between text-slate-300"><span>Ara Toplam</span><span>₺{subtotal.toFixed(2)}</span></div>
                  <div className="flex items-center justify-between text-slate-300"><span>KDV %20</span><span>₺{vat.toFixed(2)}</span></div>
                  <div className="flex items-center justify-between text-lg font-extrabold text-white"><span>Genel Toplam</span><span>₺{grandTotal.toFixed(2)}</span></div>
                </div>

                <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white transition hover:scale-[1.01]">
                  Ödeme Tamamla
                </button>
              </div>

              <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5">
                <h3 className="text-lg font-bold text-amber-100">Kritik Stok Uyarıları</h3>
                <div className="mt-3 space-y-2">
                  {critical.map((p) => (
                    <div key={p.id} className="rounded-xl bg-black/20 p-3 text-sm text-amber-50">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{p.name}</span>
                        <span>Kalan: {p.stock ?? 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
