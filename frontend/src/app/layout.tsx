import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { PaletteProvider } from '@/components/ui/CommandPalette';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', axes: ['opsz'], display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const viewport = { width: 'device-width', initialScale: 1 };

export const metadata: Metadata = {
  title: {
    default: 'KB Cloud Technologies | Cloud servers priced the way you build them',
    template: '%s | KB Cloud Technologies',
  },
  description:
    'Windows and Linux cloud servers with data in India, 24/7 human support and a price you can build yourself, one slider at a time.',
};

// Runs before first paint so the saved (or system) theme is applied without a flash.
const themeInit = `(function(){try{var t=localStorage.getItem('ch-theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lift"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <ToastProvider>
            <PaletteProvider>{children}</PaletteProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
