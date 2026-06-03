import Link from 'next/link';
import { formatPrice } from '../lib/data';
import { Product } from '../lib/types';

type ProductShowcaseProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  id?: string;
  dark?: boolean;
};

export function ProductShowcase({ eyebrow, title, description, products, id, dark = false }: ProductShowcaseProps) {
  const [lead, ...rest] = products.slice(0, 5);
  if (!lead) return null;

  return (
    <section id={id} className={dark ? 'bg-obsidian py-20 text-ivory md:py-28' : 'bg-ivory py-20 text-ink md:py-28'}>
      <div className="luxe-container">
        <div className="mb-12 grid gap-6 md:grid-cols-[.95fr_1fr] md:items-end">
          <div>
            <p className="section-eyebrow">{eyebrow}</p>
            <h2 className="mt-4 max-w-3xl font-display text-6xl leading-[.9] md:text-8xl">{title}</h2>
          </div>
          <p className={dark ? 'max-w-xl text-base leading-8 text-ivory/62 md:ml-auto' : 'max-w-xl text-base leading-8 text-ink/62 md:ml-auto'}>{description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch">
          <Link href={`/products/${lead.slug}`} className="group relative min-h-[620px] overflow-hidden rounded-[2.75rem] bg-cream shadow-luxe">
            <img src={lead.image} alt={lead.name} className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
            <div className="absolute left-7 right-7 top-7 flex items-center justify-between text-ivory">
              <span className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.24em] backdrop-blur">Signature</span>
              <span className="font-display text-4xl">{formatPrice(lead.discountedPrice ?? lead.price)}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-7 text-ivory md:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[.3em] text-gold">{lead.categoryName}</p>
              <h3 className="mt-3 max-w-xl font-display text-5xl leading-none md:text-7xl">{lead.name}</h3>
              <p className="mt-5 max-w-lg text-sm leading-7 text-ivory/70">{lead.description}</p>
            </div>
          </Link>

          <div className="grid gap-5">
            {rest.map((product, index) => (
              <Link key={product.id} href={`/products/${product.slug}`} className={dark ? 'group grid gap-5 border-t border-white/12 pt-5 sm:grid-cols-[170px_1fr]' : 'group grid gap-5 border-t border-ink/12 pt-5 sm:grid-cols-[170px_1fr]'}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 font-display text-3xl text-white drop-shadow">0{index + 2}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[.28em] text-gold">{product.badge ?? product.categoryName}</p>
                  <h3 className="mt-2 font-display text-4xl leading-none transition group-hover:text-gold">{product.name}</h3>
                  <p className={dark ? 'mt-4 text-sm leading-7 text-ivory/58' : 'mt-4 text-sm leading-7 text-ink/58'}>{product.description}</p>
                  <div className="mt-5 flex items-center gap-4">
                    <span className="font-display text-3xl">{formatPrice(product.discountedPrice ?? product.price)}</span>
                    {product.discountedPrice ? <span className={dark ? 'text-sm text-ivory/35 line-through' : 'text-sm text-ink/35 line-through'}>{formatPrice(product.price)}</span> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
