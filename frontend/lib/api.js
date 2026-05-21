const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getHealth() {
  const r = await fetch(`${API_URL}/health`, { cache: 'no-store' });
  return r.json();
}
