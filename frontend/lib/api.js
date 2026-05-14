export async function getData(path){ const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api${path}`, {cache:'no-store'}); return res.json(); }
