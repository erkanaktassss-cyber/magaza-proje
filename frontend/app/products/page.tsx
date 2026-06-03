import type { Metadata } from 'next';
import { ProductExplorer } from '../../components/product-explorer';

export const metadata: Metadata = { title: 'Katalog', description: 'Felicita Fragrances demo ürün kataloğu ve kategori filtreleri.' };

export default function ProductsPage() {
  return (
    <main>
      <section className="bg-cream pb-16 pt-36">
        <div className="luxe-container">
          <p className="section-eyebrow">Kategori sayfası</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-none text-ink md:text-7xl">Tüm kategorilerde premium katalog deneyimi.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">Arama, kategori filtresi ve fiyat sıralama ile çalışan frontend. Veriler JSON katalogdan okunur.</p>
        </div>
      </section>
      <ProductExplorer />
    </main>
  );
}
