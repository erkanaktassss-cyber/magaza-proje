'use client';

import { formatPrice } from '../../lib/data';
import { useStore } from '../../components/store-provider';

export default function CartPage() {
  const { cart, cartTotal, removeFromCart } = useStore();
  return (
    <main className="luxe-container py-14">
      <p className="section-eyebrow">Sepet ve ödeme</p><h1 className="mt-4 font-display text-6xl font-semibold">Sepet sistemi</h1>
      <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="luxe-card p-5">
          {cart.length === 0 ? <p className="text-ink/60">Sepetiniz boş. Ürün kartlarından sepete ekleyerek demo akışı deneyebilirsiniz.</p> : cart.map((line) => (
            <div key={`${line.product.id}-${line.variant}`} className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 py-4 last:border-0">
              <div><p className="font-semibold">{line.product.name}</p><p className="text-sm text-ink/55">Varyasyon: {line.variant} · Adet: {line.quantity}</p></div>
              <div className="flex items-center gap-4"><p className="font-bold">{formatPrice((line.product.discountedPrice ?? line.product.price) * line.quantity)}</p><button onClick={() => removeFromCart(line.product.id)} className="text-sm font-bold text-red-600">Sil</button></div>
            </div>
          ))}
        </section>
        <aside className="luxe-card p-6">
          <p className="section-eyebrow">Sipariş özeti</p><div className="mt-5 flex justify-between text-lg"><span>Toplam</span><strong>{formatPrice(cartTotal)}</strong></div>
          <div className="mt-6 grid gap-3 text-sm text-ink/65"><label><input type="radio" name="payment" defaultChecked /> Kapıda ödeme</label><label><input type="radio" name="payment" /> Havale / EFT</label><label><input type="radio" name="payment" /> Online ödeme entegrasyonuna hazır</label></div>
          <button className="gold-button mt-7 w-full">Misafir siparişi oluştur</button><button className="ghost-button mt-3 w-full">Üye girişi ile devam et</button>
        </aside>
      </div>
    </main>
  );
}
