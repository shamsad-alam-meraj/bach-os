import OfflineIndicator from '@/components/offline-indicator';
import PWAInstaller from '@/components/pwa-installer';
import ServiceWorkerRegister from '@/components/service-worker-register';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type React from 'react';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'bachOS',
  description: 'Bachelor meal system management with PWA support',
  authors: [{ name: 'Md. Shamsad Alam Meraj' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'bachOS',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.className} ${geistMono.className}`}>
        {children}
        <ServiceWorkerRegister />
        <PWAInstaller />
        <OfflineIndicator />
      </body>
    </html>
  );
}
