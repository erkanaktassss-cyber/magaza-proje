export default function LoginPage() {
  return (
    <main className="login-shell">
      <form className="panel login-card" action="/api/auth/login" method="post">
        <div className="badge">JWT Login</div>
        <h1>Elite Production AI Admin</h1>
        <p className="desc">PostgreSQL/Prisma üzerinde kullanıcı doğrulama, HTTP-only JWT cookie ve korumalı admin paneli.</p>
        <label>E-posta<input name="email" type="email" defaultValue="admin@eliteproduction.ai" required /></label>
        <label>Şifre<input name="password" type="password" defaultValue="Admin123!" required /></label>
        <button className="action primary" type="submit">Giriş Yap</button>
        <p className="hint">Demo: admin@eliteproduction.ai / Admin123!</p>
      </form>
    </main>
  );
}
