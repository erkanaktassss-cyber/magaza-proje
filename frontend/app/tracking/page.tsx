export default function TrackingPage() {
  return (
    <main className="luxe-container py-14">
      <p className="section-eyebrow">Kargo takip</p><h1 className="mt-4 font-display text-6xl font-semibold">Sipariş ve kargo takip alanı</h1>
      <form className="luxe-card mt-8 grid max-w-2xl gap-4 p-6"><input placeholder="Sipariş no veya kargo takip kodu" className="rounded-full border border-ink/10 px-5 py-3" /><button className="gold-button w-fit">Takip et</button><p className="text-sm text-ink/55">Demo takip kodu: TRK982314. Kargo API entegrasyonu için hazır arayüz.</p></form>
    </main>
  );
}
