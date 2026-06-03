import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/components/store-provider';

export const metadata: Metadata = {
  title: 'Elite Production AI | Üretim Kontrol Merkezi',
  description: 'Next.js, TypeScript, PostgreSQL, Prisma ve JWT ile üretim emirleri, OEE, duruş, fire, kalite, bakım ve AI asistan modülleri.',
  openGraph: { title: 'Elite Production AI', description: 'Yapay zekâ destekli premium üretim verimlilik platformu.', locale: 'tr_TR', type: 'website' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="tr"><body><StoreProvider>{children}</StoreProvider></body></html>;
}
