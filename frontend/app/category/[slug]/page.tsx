import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductExplorer } from '../../../components/product-explorer';
import { categories, categoryBySlug, productsByCategorySlug } from '../../../lib/data';

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  return { title: category?.name ?? 'Kategori', description: category?.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();
  const count = productsByCategorySlug(slug).length;

  return (
    <main>
      <section className="relative overflow-hidden bg-black pb-20 pt-40 text-white">
        <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
        <div className="luxe-container relative z-10 py-12">
          <p className="section-eyebrow">{count} ürün · Felicita kategorisi</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-none md:text-8xl">{category.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">{category.heroSubtitle}</p>
        </div>
      </section>
      <ProductExplorer initialCategory={category.id} />
    </main>
  );
}
