'use client';

import Link from 'next/link';
import { formatPrice } from '../../lib/data';
import { useStore } from '../../components/store-provider';

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, changeQuantity } = useStore();
  const shipping = cartTotal > 1200 || cart.length === 0 ? 0 : 90;
  const grandTotal = cartTotal + shipping;

  return (
    <main>
      <section className="bg-cream py-16">
        <div className="luxe-container">
          <p className="section-eyebrow">Sepet sayfası</p>
          <h1 className="mt-4 font-display text-6xl text-ink md:text-7xl">Premium checkout vitrini.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">Bu demo sepet istemci tarafında çalışır; sonraki aşamada backend, ödeme ve stok servisleri eklenebilir.</p>
        </div>
      </section>

      <section className="luxe-container grid gap-8 py-12 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-luxe md:p-6">
          {cart.length === 0 ? (
            <div className="grid min-h-96 place-items-center text-center">
              <div><p className="font-display text-4xl text-ink">Sepetiniz şu an boş.</p><p className="mt-3 text-ink/55">Katalogdan demo ürün ekleyerek checkout görünümünü test edin.</p><Link href="/products" className="mt-6 inline-flex rounded-full bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[.22em] text-white transition hover:bg-gold">Alışverişe dön</Link></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {cart.map((line) => {
                const unitPrice = line.product.discountedPrice ?? line.product.price;
                return (
                  <article key={`${line.product.id}-${line.variant}`} className="grid gap-4 rounded-[1.5rem] border border-black/10 bg-ivory p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                    <img src={line.product.image} alt={line.product.name} className="aspect-square w-full rounded-2xl object-cover md:w-[120px]" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-gold">{line.product.categoryName}</p>
                      <Link href={`/products/${line.product.slug}`} className="mt-1 block font-display text-3xl text-ink">{line.product.name}</Link>
                      <p className="mt-2 text-sm text-ink/55">Varyasyon: {line.variant ?? 'Standart'} · Birim: {formatPrice(unitPrice)}</p>
                      <div className="mt-4 flex w-fit items-center rounded-full border border-black/10 bg-white">
                        <button className="px-4 py-2" onClick={() => changeQuantity(line.product.id, line.variant, line.quantity - 1)}>-</button>
                        <span className="min-w-8 text-center text-sm">{line.quantity}</span>
                        <button className="px-4 py-2" onClick={() => changeQuantity(line.product.id, line.variant, line.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-display text-3xl text-ink">{formatPrice(unitPrice * line.quantity)}</p>
                      <button onClick={() => removeFromCart(line.product.id, line.variant)} className="mt-3 text-xs font-semibold uppercase tracking-[.2em] text-red-700">Sil</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[2rem] bg-obsidian p-7 text-ivory shadow-luxe lg:sticky lg:top-28">
          <p className="section-eyebrow">Sipariş özeti</p>
          <div className="mt-6 grid gap-4 text-sm text-ivory/65">
            <div className="flex justify-between"><span>Ara toplam</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="flex justify-between"><span>Kargo</span><span>{shipping ? formatPrice(shipping) : 'Ücretsiz'}</span></div>
            <div className="h-px bg-white/10" />
            <div className="flex items-end justify-between text-white"><span>Toplam</span><strong className="font-display text-4xl">{formatPrice(grandTotal)}</strong></div>
          </div>
          <div className="mt-7 grid gap-3 text-sm text-ivory/68">
            <label className="rounded-2xl border border-white/10 p-4"><input type="radio" name="payment" defaultChecked /> Kapıda ödeme demo</label>
            <label className="rounded-2xl border border-white/10 p-4"><input type="radio" name="payment" /> Havale / EFT demo</label>
            <label className="rounded-2xl border border-white/10 p-4"><input type="radio" name="payment" /> Online ödeme entegrasyonuna hazır</label>
          </div>
          <button className="mt-7 w-full rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[.22em] text-black transition hover:bg-gold hover:text-white">Demo sipariş oluştur</button>
        </aside>
      </section>
    </main>
  );
}
