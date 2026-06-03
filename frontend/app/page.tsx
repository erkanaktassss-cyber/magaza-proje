import Link from 'next/link';
import { CategoryEditorial } from '../components/CategoryEditorial';
import { Hero } from '../components/Hero';
import { ProductShowcase } from '../components/ProductShowcase';
import { categories, products, whatsappNumber } from '../lib/data';

const byCategory = (categoryId: string) => products.filter((product) => product.categoryId === categoryId);
const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 5);
const perfumeProducts = byCategory('parfum').slice(0, 5);
const naturalCareProducts = products.filter((product) => ['dogal-krem', 'dogal-sabun'].includes(product.categoryId)).slice(0, 5);
const soapAromaProducts = products.filter((product) => ['dogal-sabun', 'aromaterapi', 'mum'].includes(product.categoryId)).slice(0, 5);
const packagingProducts = byCategory('kalip-ambalaj').slice(0, 5);

const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Merhaba, Felicita premium katalogdan sipariş vermek istiyorum.')}`;

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="bg-obsidian py-5 text-ivory">
        <div className="luxe-container flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-semibold uppercase tracking-[.3em] text-ivory/60">
          <span>White cream palette</span><span>Black typography</span><span>Gold details</span><span>Editorial commerce</span><span>Mobile luxury</span>
        </div>
      </section>

      <CategoryEditorial categories={categories} />

      <ProductShowcase
        id="perfume"
        eyebrow="Parfüm koleksiyonu"
        title="Şişede güçlü, sayfada sessiz bir imza."
        description="Klasik kart düzeni yerine büyük ürün fotoğrafı, zarif boşluk ve nota odaklı editorial akışla parfüm seçkisi premium bir vitrine dönüşür."
        products={perfumeProducts}
      />

      <ProductShowcase
        id="natural-care"
        eyebrow="Doğal bakım ürünleri"
        title="Banyo rafı için krem tonlu bakım ritüelleri."
        description="Shea, bitkisel yağ, balm ve doğal sabun dokuları; L’Occitane ve Rituals hissine yakın yumuşak bir spa estetiğiyle sunulur."
        products={naturalCareProducts}
        dark
      />

      <ProductShowcase
        id="soap-aroma"
        eyebrow="Sabun ve aromaterapi"
        title="Koku, ışık ve temizlik aynı sahnede."
        description="Sabun, mum ve aromaterapi ürünleri ev atmosferini tamamlayan büyük görsellerle, kategori kutusu gibi değil marka kampanyası gibi görünür."
        products={soapAromaProducts}
      />

      <ProductShowcase
        id="packaging"
        eyebrow="Üretim kalıpları ve ambalaj"
        title="Butik üretime premium raf değeri kazandıran detaylar."
        description="Şişe, kalıp, kutu ve ambalaj ürünleri de aynı lüks katalog dilinde ele alınır; üretici malzemesi görünümünden çıkıp marka vitrininin parçası olur."
        products={packagingProducts}
        dark
      />

      <ProductShowcase
        id="best-sellers"
        eyebrow="Çok satanlar"
        title="En çok seçilen ritüeller, sakin bir kürasyonla."
        description="Çok satanlar alanı fiyat ve stok baskısı yerine ürünün formunu, dokusunu ve kullanım hissini öne çıkaran premium bir editör seçkisi olarak tasarlandı."
        products={bestSellers}
      />

      <section className="bg-[#efe3cf] py-20 text-ink md:py-28">
        <div className="luxe-container grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-[560px] overflow-hidden rounded-[3rem] shadow-luxe">
            <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=90" alt="Doğal bakım ve parfüm marka hikayesi" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <p className="absolute bottom-8 left-8 right-8 font-display text-5xl leading-none text-white md:text-6xl">Atelier sessizliği, raf etkisi ve dokunsal lüks.</p>
          </div>
          <div>
            <p className="section-eyebrow">Marka hikayesi</p>
            <h2 className="mt-4 font-display text-6xl leading-[.9] md:text-8xl">Felicita bir ürün listesi değil, ritüel hissi satar.</h2>
            <p className="mt-8 text-lg leading-9 text-ink/62">Bu ana sayfa, backend karmaşasına girmeden markanın ilk izlenimini yükseltmek için yeniden kurgulandı. Büyük serif başlıklar, rafine sans-serif açıklamalar, beyaz/krem zemin, siyah metin ve altın mikro detaylar premium kozmetik ve parfümeri markalarının sakin dilini hedefler.</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {['JSON katalog', 'Admin yok', 'Veritabanı yok'].map((item) => (
                <div key={item} className="border-l border-gold pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[.24em] text-ink/50">Frontend</p>
                  <p className="mt-2 font-display text-3xl">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="whatsapp" className="relative overflow-hidden bg-ivory py-20 text-ink md:py-28">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="luxe-container grid overflow-hidden rounded-[3rem] bg-obsidian text-ivory shadow-luxe lg:grid-cols-[1fr_.8fr]">
          <div className="p-8 md:p-14">
            <p className="section-eyebrow">WhatsApp sipariş çağrısı</p>
            <h2 className="mt-4 max-w-3xl font-display text-6xl leading-[.9] md:text-8xl">Katalogdan seç, ritüelini WhatsApp’ta tamamla.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-ivory/62">Demo aşamasında öncelik tasarım olduğu için sipariş çağrısı sade tutuldu. Kullanıcı premium vitrinden etkilenir, sonra WhatsApp üzerinden hızlı iletişime geçer.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[.26em] text-obsidian transition hover:bg-ivory">WhatsApp ile sipariş</a>
              <Link href="/products" className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-xs font-semibold uppercase tracking-[.26em] text-ivory transition hover:border-gold hover:text-gold">Tüm kataloğu gör</Link>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1400&q=90" alt="Premium ürün sipariş çağrısı" className="h-full min-h-[430px] w-full object-cover opacity-88" />
        </div>
      </section>
    </main>
  );
}
