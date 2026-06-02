import Link from 'next/link';
import { categories, products, whatsappNumber } from '../lib/data';
import { ProductCard } from '../components/product-card';

const sectionMap = [
  { title: 'Çok satan ürünler', subtitle: 'Mağazanın güven veren favorileri', products: products.filter((product) => product.isBestSeller) },
  { title: 'Yeni gelenler', subtitle: 'Atölyeden taze çıkan koleksiyon', products: products.filter((product) => product.isNew) },
  { title: 'Parfüm koleksiyonu', subtitle: 'Kalıcı, modern ve imza kokular', products: products.filter((product) => product.categoryId === 'perfume') },
  { title: 'Doğal sabun ve bakım ürünleri', subtitle: 'Temiz içerikli günlük ritüeller', products: products.filter((product) => ['natural-soap', 'handmade-soap', 'care'].includes(product.categoryId)) },
  { title: 'Üretim malzemeleri ve kalıplar', subtitle: 'Butik üretim için profesyonel ekipmanlar', products: products.filter((product) => product.categoryId === 'supplies' || product.categoryId === 'epoxy') },
  { title: 'Kampanyalı ürünler', subtitle: 'Seçili ürünlerde dönemsel fırsatlar', products: products.filter((product) => product.isCampaign) }
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-hero-luxe">
        <div className="luxe-container grid min-h-[720px] items-center gap-12 py-16 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="section-eyebrow">Premium doğal mağaza</p>
            <h1 className="mt-5 max-w-3xl font-display text-6xl font-semibold leading-[.92] text-ink md:text-8xl">Doğal, Kalıcı ve Özel Ürünler</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink/70">Biolife Atelier; parfüm, doğal bakım, aromaterapi, mum, epoksi hediyelik ve üretim ekipmanlarını lüks mağaza deneyimiyle bir araya getirir.</p>
            <div className="mt-9 flex flex-wrap gap-4"><Link href="/products" className="gold-button">Alışverişe başla</Link><a href={`https://wa.me/${whatsappNumber}`} className="ghost-button">WhatsApp hızlı sipariş</a></div>
          </div>
          <div className="luxe-card bg-obsidian/95 p-5 text-ivory">
            <div className="product-art aspect-[4/5] bg-gradient-to-br from-black via-amber-950 to-gold p-8">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="self-end rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-champagne">Signature</div>
                <div><p className="font-display text-5xl">Amber Oud</p><p className="mt-3 text-sm leading-6 text-ivory/70">Parfüm koleksiyonu, doğal bakım ve üretim malzemeleri tek premium altyapıda.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="luxe-container py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="section-eyebrow">Kategoriler</p><h2 className="mt-3 font-display text-5xl font-semibold">Öne çıkan kategoriler</h2></div><Link href="/products" className="ghost-button">Tüm ürünler</Link></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.filter((category) => category.featured).map((category) => (
            <Link href={`/products?category=${category.id}`} key={category.id} className={`rounded-[2rem] bg-gradient-to-br ${category.imageTone} p-6 text-white shadow-luxe transition hover:-translate-y-1`}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">Biolife Atelier</p><h3 className="mt-14 font-display text-3xl font-semibold">{category.name}</h3><p className="mt-3 text-sm leading-6 text-white/75">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {sectionMap.map((section) => (
        <section key={section.title} className="luxe-container py-10">
          <div className="mb-7"><p className="section-eyebrow">{section.subtitle}</p><h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{section.title}</h2></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{section.products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </section>
      ))}

      <section id="story" className="luxe-container py-16">
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[2.5rem] bg-obsidian p-10 text-ivory"><p className="section-eyebrow">Marka hikayesi</p><h2 className="mt-4 font-display text-5xl font-semibold">Doğal içerik, atölye ruhu ve lüks sunum.</h2><p className="mt-6 leading-8 text-ivory/70">Biolife Atelier, butik üretim yapan işletmelerin ve seçici müşterilerin aynı mağazada güvenle alışveriş yapması için tasarlandı. Stok, varyasyon, kampanya ve sipariş akışları gerçek projeye uygun şekilde kurgulandı.</p></div>
          <div className="luxe-card grid gap-4 p-8 md:grid-cols-3"><div><p className="text-4xl font-bold">10+</p><p className="mt-2 text-sm text-ink/60">Demo ürün ve çok kategori</p></div><div><p className="text-4xl font-bold">6</p><p className="mt-2 text-sm text-ink/60">Varyasyon tipi</p></div><div><p className="text-4xl font-bold">SEO</p><p className="mt-2 text-sm text-ink/60">Ürün detay sayfaları</p></div></div>
        </div>
      </section>

      <section className="luxe-container pb-20">
        <div className="rounded-[2.5rem] bg-gradient-to-r from-ink to-black p-8 text-ivory md:p-12"><p className="section-eyebrow">WhatsApp hızlı sipariş</p><div className="mt-4 flex flex-wrap items-center justify-between gap-6"><h2 className="max-w-2xl font-display text-4xl font-semibold">Ürün seçimi, stok ve özel paket talepleriniz için anında destek alın.</h2><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Merhaba, Biolife Atelier ürünleri için hızlı sipariş vermek istiyorum.')}`} className="rounded-full bg-gold px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-ink">WhatsApp ile sipariş ver</a></div></div>
      </section>
    </main>
  );
}
