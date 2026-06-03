import Link from 'next/link';

const heroHighlights = ['Parfüm atelier', 'Doğal bakım', 'Ritüel ambalaj'];

export function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#f8f1e6] text-ink">
      <img
        src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?auto=format&fit=crop&w=2200&q=92"
        alt="Altın ışıkta lüks parfüm ve bakım vitrini"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,241,230,.97)_0%,rgba(248,241,230,.86)_34%,rgba(248,241,230,.22)_68%,rgba(15,13,11,.34)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ivory via-ivory/80 to-transparent" />
      <div className="absolute left-1/2 top-24 hidden h-[72vh] w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent lg:block" />

      <div className="luxe-container relative z-10 flex min-h-screen items-end pb-12 pt-32 md:pb-16 lg:items-center lg:pb-0">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div className="max-w-5xl reveal">
            <p className="section-eyebrow">Felicita Fragrances · premium ritual storefront</p>
            <h1 className="mt-6 max-w-5xl font-display text-[clamp(4.6rem,13vw,12.5rem)] leading-[.78] tracking-[-.08em] text-ink">
              Sessiz lüksün koku hafızası.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-ink/68 md:text-xl md:leading-9">
              Parfüm, doğal bakım, sabun, aromaterapi ve butik üretim ambalajları için beyaz-krem paletli, altın detaylı ve editorial katalog hissinde bir ana vitrin.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="#signature" className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-4 text-xs font-semibold uppercase tracking-[.28em] text-ivory transition hover:bg-gold">
                Koleksiyonları keşfet
              </Link>
              <Link href="#whatsapp" className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-ivory/45 px-8 py-4 text-xs font-semibold uppercase tracking-[.28em] text-ink backdrop-blur transition hover:border-gold hover:text-gold">
                WhatsApp sipariş
              </Link>
            </div>
          </div>

          <aside className="reveal rounded-[2rem] border border-white/50 bg-ivory/70 p-5 shadow-luxe backdrop-blur-xl md:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[.3em] text-gold">Atelier notes</p>
            <p className="mt-4 font-display text-3xl leading-none text-ink">Lüks görünüm backend’den önce gelir.</p>
            <div className="mt-6 grid gap-3">
              {heroHighlights.map((item, index) => (
                <div key={item} className="flex items-center gap-4 border-t border-ink/10 pt-3">
                  <span className="font-display text-3xl text-gold">0{index + 1}</span>
                  <span className="text-xs font-semibold uppercase tracking-[.22em] text-ink/58">{item}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
