import { NextRequest, NextResponse } from 'next/server';
import { authCookie, createJwt, verifyPassword } from '@/lib/auth';
import { findUserByEmail } from '@/lib/db';

export async function POST(request: NextRequest) {
  const isForm = request.headers.get('content-type')?.includes('application/x-www-form-urlencoded') || request.headers.get('content-type')?.includes('multipart/form-data');
  const payload = isForm ? Object.fromEntries((await request.formData()).entries()) : await request.json();
  const email = String(payload.email || '');
  const password = String(payload.password || '');
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: 'Geçersiz kullanıcı veya şifre' }, { status: 401 });
  const token = createJwt({ id: user.id, email: user.email, name: user.name, role: user.role });
  const response = isForm ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  response.cookies.set(authCookie(token));
  return response;
}
