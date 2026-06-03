'use client';

import Link from 'next/link';
import { useStore } from '../../components/store-provider';

export function CartLink() {
  const { cartCount } = useStore();
  return <Link href="/cart" className="rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[.2em] text-white transition hover:bg-gold">Sepet ({cartCount})</Link>;
}
