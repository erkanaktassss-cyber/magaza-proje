import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '../../../components/product-card';
import { ProductDetailActions } from '../../../components/product-detail-actions';
import { formatPrice, productBySlug, products, whatsappNumber } from '../../../lib/data';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: 'Ürün bulunamadı' };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 4);
  const price = product.discountedPrice ?? product.price;
  const message = encodeURIComponent(`${product.name} için premium demo sipariş bilgisi almak istiyorum.`);

  return (
    <main>
      <section className="luxe-container grid gap-10 py-14 lg:grid-cols-[1.05fr_.95fr]">
        <div className="grid gap-4 md:grid-cols-[.18fr_.82fr]">
          <div className="hidden gap-4 md:grid">
            {product.gallery.map((image) => <img key={image} src={image} alt={product.name} className="aspect-square rounded-3xl object-cover shadow-luxe" />)}
          </div>
          <div className="luxe-ring overflow-hidden rounded-[3rem] bg-cream shadow-luxe">
            <img src={product.image} alt={product.name} className="h-[680px] w-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Link href={`/category/${product.categoryId}`} className="section-eyebrow">{product.categoryName}</Link>
          <h1 className="mt-4 font-display text-6xl leading-none text-ink md:text-7xl">{product.name}</h1>
          <p className="mt-6 text-lg leading-8 text-ink/65">{product.description}</p>
          <div className="mt-7 flex flex-wrap items-end gap-4">
            {product.discountedPrice ? <span className="text-xl text-ink/35 line-through">{formatPrice(product.price)}</span> : null}
            <span className="font-display text-5xl text-ink">{formatPrice(price)}</span>
            <span className="rounded-full bg-cream px-4 py-2 text-sm text-ink/55">{product.stock} stok</span>
          </div>
          <ProductDetailActions product={product} />
          <a href={`https://wa.me/${whatsappNumber}?text=${message}`} className="mt-3 inline-flex justify-center rounded-full border border-black/15 px-8 py-4 text-xs font-semibold uppercase tracking-[.22em] transition hover:border-gold hover:text-gold">WhatsApp hızlı danışma</a>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {product.notes.map((note) => <div key={note} className="rounded-3xl border border-black/10 bg-white p-4 text-sm leading-6 text-ink/62">{note}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-cream pb-16 pt-36">
        <div className="luxe-container grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="section-eyebrow">Ürün ritüeli</p><h2 className="mt-3 font-display text-5xl text-ink">Detaylı deneyim</h2></div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-7 shadow-luxe"><h3 className="font-display text-3xl">Açıklama</h3><p className="mt-4 leading-8 text-ink/62">{product.longDescription}</p></div>
            <div className="rounded-[2rem] bg-obsidian p-7 text-ivory shadow-luxe"><h3 className="font-display text-3xl">Kullanım</h3><p className="mt-4 leading-8 text-ivory/65">{product.ritual}</p></div>
          </div>
        </div>
      </section>

      <section className="luxe-container py-16">
        <div className="mb-9"><p className="section-eyebrow">Benzer ürünler</p><h2 className="mt-3 font-display text-5xl text-ink">Aynı koleksiyondan</h2></div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
      </section>
    </main>
  );
}
