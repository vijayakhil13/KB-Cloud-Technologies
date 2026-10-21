import Link from 'next/link';
import { CloudIcon } from '@heroicons/react/24/outline';
import Illustration from '@/components/ui/Illustration';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface AuthShellProps {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  quote?: { text: string; by: string };
  children: React.ReactNode;
}

export default function AuthShell({ title, subtitle, footer, quote, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg font-display text-lg font-medium tracking-tight text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-fg">
              <CloudIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
            </span>
            KB Cloud Technologies
          </Link>
          <ThemeToggle />
        </div>
        <Illustration name="hills" className="mt-6 h-24 w-full rounded-2xl bg-primary-soft lg:hidden" />
        <main id="main" className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl font-medium tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-sm text-ink-soft">{footer}</p>
        </main>
      </div>

      <aside className="relative hidden overflow-hidden bg-primary-soft lg:flex lg:items-end lg:p-12" aria-hidden={quote ? undefined : true}>
        <Illustration name="clouds" className="absolute inset-0 h-full w-full" />
        {quote && (
          <figure className="relative max-w-md rounded-2xl border border-border bg-surface/95 p-6 shadow-lift">
            <blockquote className="font-display text-lg leading-snug text-ink">&ldquo;{quote.text}&rdquo;</blockquote>
            <figcaption className="mt-3 text-sm text-ink-muted">{quote.by}</figcaption>
          </figure>
        )}
      </aside>
    </div>
  );
}
