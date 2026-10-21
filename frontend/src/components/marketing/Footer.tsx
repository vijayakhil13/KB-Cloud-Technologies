import Link from 'next/link';
import { Logo } from './Navbar';

const cols = [
  {
    title: 'Product',
    links: [
      { href: '#build', label: 'Build a server' },
      { href: '#plans', label: 'Plans' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/auth/login', label: 'Sign in' },
      { href: '/auth/register', label: 'Create account' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '#why', label: 'Why us' },
      { href: '#contact', label: 'Contact' },
      { href: 'mailto:support@kbcloudtechnologies.com', label: 'support@kbcloudtechnologies.com' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Calm, honest cloud servers with data in India and people who pick up the phone.
            </p>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="text-sm font-semibold text-ink">{c.title}</h2>
              <ul className="mt-4 space-y-1">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('/') ? (
                      <Link href={l.href} className="inline-flex min-h-9 items-center text-sm text-ink-soft hover:text-ink">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="inline-flex min-h-9 items-center break-all text-sm text-ink-soft hover:text-ink">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 border-t border-border pt-6 text-sm text-ink-muted">
          &copy; {new Date().getFullYear()} KB Cloud Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
