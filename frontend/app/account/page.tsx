export default function AccountPage() {
  return (
    <main className="luxe-container py-14">
      <p className="section-eyebrow">Üyelik</p><h1 className="mt-4 font-display text-6xl font-semibold">Kullanıcı üyeliği ve misafir siparişi</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form className="luxe-card grid gap-4 p-6"><h2 className="font-display text-3xl">Üye girişi</h2><input placeholder="E-posta" className="rounded-full border border-ink/10 px-5 py-3" /><input placeholder="Şifre" type="password" className="rounded-full border border-ink/10 px-5 py-3" /><button className="gold-button">Giriş yap</button></form>
        <form className="luxe-card grid gap-4 p-6"><h2 className="font-display text-3xl">Yeni müşteri</h2><input placeholder="Ad Soyad" className="rounded-full border border-ink/10 px-5 py-3" /><input placeholder="Telefon" className="rounded-full border border-ink/10 px-5 py-3" /><button className="ghost-button">Hesap oluştur</button></form>
      </div>
    </main>
  );
}
