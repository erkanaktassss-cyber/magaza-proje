import type { Metadata } from 'next';
import { ProductExplorer } from '../../components/product-explorer';

export const metadata: Metadata = { title: 'Ürünler', description: 'Biolife Atelier ürün arama, kategori filtreleme, stok ve kampanya listesi.' };

export default function ProductsPage() {
  return (
    <main>
      <section className="bg-cream py-16"><div className="luxe-container"><p className="section-eyebrow">Mağaza</p><h1 className="mt-4 font-display text-6xl font-semibold">Ürün arama ve filtreleme</h1><p className="mt-5 max-w-2xl text-ink/65">Parfümden üretim ekipmanlarına kadar tüm ürünleri kategori, stok ve fiyata göre filtreleyin.</p></div></section>
      <ProductExplorer />
    </main>
  );
}
