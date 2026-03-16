import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { PageTransition } from '@/components/ui/PageTransition';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ToastProvider } from '@/components/ui/Toast';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Backend Cookbook',
  description: 'A gamified backend engineering showcase platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body
        className="min-h-screen font-sans antialiased"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Ambient background blobs — purely decorative */}
        <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="ambient-blob ambient-blob-blue" />
          <div className="ambient-blob ambient-blob-emerald" />
          <div className="ambient-blob ambient-blob-purple" />
        </div>
        <CustomCursor />
        <ScrollToTop />
        <ToastProvider>
          <Navbar />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
