import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatPrice, productBySlug, products, whatsappNumber } from '../../../lib/data';
import { ProductCard } from '../../../components/product-card';
import { ProductDetailActions } from '../../../components/product-detail-actions';

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = productBySlug(params.slug);
  if (!product) return { title: 'Ürün bulunamadı' };
  return { title: product.name, description: product.description, openGraph: { title: product.name, description: product.description } };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = productBySlug(params.slug);
  if (!product) notFound();
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 4);

  return (
    <main className="luxe-container py-12">
      <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <div className={`product-art aspect-[4/5] bg-gradient-to-br ${product.imageTone} p-8`}><div className="relative z-10 flex h-full items-end"><span className="rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[.24em] text-ink">{product.categoryName}</span></div></div>
        <section>
          <p className="section-eyebrow">Ürün detay sayfası</p><h1 className="mt-4 font-display text-6xl font-semibold leading-none">{product.name}</h1><p className="mt-5 text-lg leading-8 text-ink/65">{product.description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">{product.discountedPrice && <span className="text-2xl text-ink/35 line-through">{formatPrice(product.price)}</span>}<span className="text-4xl font-bold">{formatPrice(product.discountedPrice ?? product.price)}</span><span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">Stok: {product.stock}</span></div>
          <ProductDetailActions product={product} />
          <div className="mt-8 grid gap-3 rounded-[2rem] bg-white p-5 shadow-luxe sm:grid-cols-2">
            {product.variants.map((variant) => <div key={`${variant.type}-${variant.label}`} className="rounded-2xl border border-ink/10 p-4"><p className="text-xs font-bold uppercase tracking-[.22em] text-gold">{variant.type}</p><p className="mt-2 font-semibold">{variant.label}</p><p className="text-sm text-ink/55">Stok: {variant.stock}{variant.priceDelta ? ` · ${variant.priceDelta > 0 ? '+' : ''}${formatPrice(variant.priceDelta)}` : ''}</p></div>)}
          </div>
          <a className="mt-5 inline-flex text-sm font-bold text-gold" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${product.name} için sipariş vermek istiyorum.`)}`}>WhatsApp ile bu ürünü sor</a>
        </section>
      </div>

      <section className="mt-12 grid gap-5 lg:grid-cols-3">
        {product.perfumeDetails && Object.entries({ 'Koku ailesi': product.perfumeDetails.fragranceFamily, 'Üst nota': product.perfumeDetails.topNotes, 'Orta nota': product.perfumeDetails.heartNotes, 'Alt nota': product.perfumeDetails.baseNotes, 'Kadın / erkek / unisex': product.perfumeDetails.gender, 'Kalıcılık seviyesi': product.perfumeDetails.longevity, 'Kullanım zamanı': product.perfumeDetails.usageTime, 'Benzer koku tipi': product.perfumeDetails.similarScentType }).map(([key, value]) => <Info key={key} label={key} value={value} />)}
        {product.naturalDetails && Object.entries({ İçerik: product.naturalDetails.ingredients, 'Cilt tipi': product.naturalDetails.skinType, Gramaj: product.naturalDetails.weight, 'Kullanım şekli': product.naturalDetails.usage, Uyarılar: product.naturalDetails.warnings }).map(([key, value]) => <Info key={key} label={key} value={value} />)}
        {product.supplyDetails && Object.entries({ 'Malzeme türü': product.supplyDetails.materialType, Ölçü: product.supplyDetails.dimensions, 'Uyumlu ürünler': product.supplyDetails.compatibleProducts, 'Paket içeriği': product.supplyDetails.packageContent }).map(([key, value]) => <Info key={key} label={key} value={value} />)}
      </section>

      {related.length > 0 && <section className="py-14"><h2 className="font-display text-4xl font-semibold">Benzer ürünler</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="luxe-card p-5"><p className="text-xs font-bold uppercase tracking-[.22em] text-gold">{label}</p><p className="mt-2 text-ink/75">{value}</p></div>; }
