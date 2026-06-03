import Link from 'next/link';
import { Category } from '../lib/types';

type CategoryEditorialProps = {
  categories: Category[];
};

export function CategoryEditorial({ categories }: CategoryEditorialProps) {
  return (
    <section id="signature" className="bg-[#f2e7d5] py-20 text-ink md:py-28">
      <div className="luxe-container">
        <div className="mb-12 max-w-4xl">
          <p className="section-eyebrow">Signature collections</p>
          <h2 className="mt-4 font-display text-6xl leading-[.9] md:text-8xl">Kategoriler kutu değil, kampanya görseli gibi.</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-12 lg:auto-rows-[280px]">
          {categories.map((category, index) => {
            const large = index === 0 || index === 3 || index === 6;
            return (
              <Link
                href={`/category/${category.slug}`}
                key={category.id}
                className={`group relative overflow-hidden rounded-[2.5rem] bg-obsidian shadow-luxe ${large ? 'lg:col-span-7 lg:row-span-2' : 'lg:col-span-5'}`}
              >
                <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                  <div className="mb-5 flex items-center gap-4">
                    <span className="h-px w-10 bg-gold" />
                    <span className="text-[11px] font-semibold uppercase tracking-[.28em] text-white/62">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-5xl leading-none md:text-6xl">{category.name}</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/68">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
