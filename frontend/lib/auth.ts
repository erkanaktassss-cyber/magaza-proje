import { createHmac, randomBytes, timingSafeEqual, pbkdf2Sync } from 'crypto';
import { cookies } from 'next/headers';
import { demoUser, type Role } from './production-data';

export type SessionUser = { id: string; email: string; name: string; role: Role };

const secret = () => process.env.JWT_SECRET || 'elite-production-ai-dev-secret';
const tokenName = 'elite_token';

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function sign(data: string) {
  return createHmac('sha256', secret()).update(data).digest('base64url');
}

export function createJwt(payload: SessionUser, expiresInSeconds = 60 * 60 * 8) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
  return `${header}.${body}.${sign(`${header}.${body}`)}`;
}

export function verifyJwt(token?: string): SessionUser | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = sign(`${header}.${body}`);
  const sig = Buffer.from(signature);
  const exp = Buffer.from(expected);
  if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionUser & { exp: number };
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return { id: payload.id, email: payload.email, name: payload.name, role: payload.role };
}

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, original] = stored.split(':');
  if (!salt || !original) return false;
  const hash = hashPassword(password, salt).split(':')[1];
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(original, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function currentUser() {
  const store = await cookies();
  return verifyJwt(store.get(tokenName)?.value);
}

export function authCookie(token: string) {
  return {
    name: tokenName,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  };
}

export function demoSession(): SessionUser {
  return { id: demoUser.id, email: demoUser.email, name: demoUser.name, role: demoUser.role };
}
