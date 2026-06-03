import Link from 'next/link';
import { categories, featuredProducts, products } from '../lib/data';
import { ProductCard } from '../components/product-card';

const stats = [
  ['35+', 'Demo ürün'],
  ['7', 'Premium kategori'],
  ['0', 'Veritabanı bağımlılığı']
];

export default function HomePage() {
  return (
    <main>
      <section className="hero-grid overflow-hidden bg-ivory">
        <div className="luxe-container grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.02fr_.98fr]">
          <div className="reveal">
            <p className="section-eyebrow">Premium ritual commerce</p>
            <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[.9] text-ink md:text-8xl">Sessiz lüks, güçlü koku ve kusursuz mağaza hissi.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/65">Felicita Fragrances; parfüm, esans, doğal bakım, aromaterapi, mum ve üretim ambalajlarını Jo Malone, Rituals ve L'Occitane hissinde tek bir premium vitrinde buluşturur.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[.24em] text-white transition hover:bg-gold">Kataloğu keşfet</Link>
              <Link href="/category/parfum" className="rounded-full border border-black/15 px-8 py-4 text-xs font-semibold uppercase tracking-[.24em] transition hover:border-gold hover:text-gold">Parfüm koleksiyonu</Link>
            </div>
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
              {stats.map(([value, label]) => <div key={label} className="border-l border-black/15 pl-4"><p className="font-display text-4xl">{value}</p><p className="mt-1 text-xs uppercase tracking-[.2em] text-ink/45">{label}</p></div>)}
            </div>
          </div>
          <div className="relative reveal">
            <div className="absolute -left-8 top-12 z-10 hidden rounded-full bg-white/80 px-5 py-3 text-xs font-semibold uppercase tracking-[.24em] shadow-luxe backdrop-blur md:block">Investor-ready UI</div>
            <div className="luxe-ring float-slow overflow-hidden rounded-[3rem] bg-black p-3 shadow-[0_40px_120px_rgba(0,0,0,.25)]">
              <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=90" alt="Premium parfüm şişeleri" className="h-[640px] w-full rounded-[2.4rem] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-obsidian py-5 text-ivory">
        <div className="luxe-container flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs font-semibold uppercase tracking-[.28em] text-ivory/65">
          <span>Beyaz</span><span>Krem</span><span>Siyah</span><span>Premium kartlar</span><span>Mobil uyumlu</span><span>Animasyonlu</span>
        </div>
      </section>

      <section className="luxe-container py-20" id="categories">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div><p className="section-eyebrow">Kategoriler</p><h2 className="mt-3 font-display text-5xl text-ink md:text-6xl">Ritüel odaklı koleksiyonlar</h2></div>
          <Link href="/products" className="rounded-full border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-[.22em] transition hover:border-gold hover:text-gold">Tüm ürünler</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Link href={`/category/${category.slug}`} key={category.id} className={`group relative min-h-80 overflow-hidden rounded-[2.25rem] bg-gradient-to-br ${category.accent} p-6 text-white shadow-luxe`}>
              <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:scale-110 group-hover:opacity-45" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="w-fit rounded-full border border-white/25 px-3 py-1 text-[10px] uppercase tracking-[.26em] text-white/70">0{index + 1}</span>
                <div><h3 className="font-display text-4xl">{category.name}</h3><p className="mt-3 text-sm leading-6 text-white/72">{category.description}</p></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="luxe-container pb-20">
        <div className="mb-10"><p className="section-eyebrow">Editör seçimi</p><h2 className="mt-3 font-display text-5xl text-ink md:text-6xl">Profesyonel ürün kartları</h2></div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.slice(0, 8).map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}
        </div>
      </section>

      <section className="luxe-container pb-24">
        <div className="grid overflow-hidden rounded-[3rem] bg-obsidian text-ivory shadow-luxe lg:grid-cols-[.95fr_1.05fr]">
          <div className="p-9 md:p-14"><p className="section-eyebrow">Brand presentation</p><h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">Mimari sonra. İlk izlenim şimdi.</h2><p className="mt-6 text-base leading-8 text-ivory/65">Bu aşama backend karmaşası olmadan çalışan, yatırımcıya gösterilebilir lüks frontend vitrini üretir. Katalog JSON'dan gelir, ürün detayları statik oluşturulur, sepet istemci tarafında çalışır.</p></div>
          <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85" alt="Premium bakım vitrini" className="h-full min-h-[420px] w-full object-cover" />
        </div>
      </section>
    </main>
  );
}
