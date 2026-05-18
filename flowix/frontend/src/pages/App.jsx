import React, { useEffect, useState } from 'react';
import axios from 'axios';

const modules = ['Satış', 'Ürünler', 'Stok', 'Müşteriler', 'Raporlar', 'Ayarlar'];

export default function App() {
  const [products, setProducts] = useState([]);
  const [dashboard, setDashboard] = useState({ todaySales: 0, criticalStock: [] });

  useEffect(() => {
    axios.get('http://localhost:4010/api/products').then((r) => setProducts(r.data));
    axios.get('http://localhost:4010/api/dashboard').then((r) => setDashboard(r.data));
  }, []);

  return <div className="min-h-screen p-4 md:p-8">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl font-bold">FLOWIX POS</h1>
      <div className="rounded-xl bg-emerald-600/20 px-4 py-2">Günlük Satış: ₺{dashboard.todaySales}</div>
    </header>

    <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6">{modules.map((m) => <button key={m} className="btn bg-slate-800 hover:bg-slate-700">{m}</button>)}</section>

    <section className="grid gap-4 lg:grid-cols-2">
      <div className="card">
        <h2 className="mb-3 text-xl font-semibold">Hızlı Satış Ekranı</h2>
        <input placeholder="Barkod veya ürün ara" className="mb-3 w-full rounded-xl bg-slate-800 p-4 text-lg" />
        <div className="space-y-2">{products.slice(0, 5).map((p) => <div className="flex items-center justify-between rounded-xl bg-slate-800 p-3" key={p.id}><span>{p.name}</span><span>₺{p.sale_price}</span></div>)}</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="btn bg-emerald-600">Nakit</button><button className="btn bg-sky-600">Kart</button>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-3 text-xl font-semibold">Kritik Stok Uyarıları</h2>
        {dashboard.criticalStock.map((p) => <div key={p.id} className="mb-2 rounded-xl bg-amber-700/30 p-3">{p.name} - Kalan: {p.stock}</div>)}
        {dashboard.criticalStock.length === 0 && <p>Bugün kritik stok yok.</p>}
      </div>
    </section>
  </div>;
}
