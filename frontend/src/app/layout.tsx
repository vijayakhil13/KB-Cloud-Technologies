import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const viewport = { width: 'device-width', initialScale: 1 };

export const metadata: Metadata = {
  title: 'CloudHost — Cloud Server Hosting',
  description:
    'Windows & Linux cloud servers, remote desktops and business application hosting for your growing business.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-page text-gray-900 antialiased">{children}</body>
    </html>
  );
}