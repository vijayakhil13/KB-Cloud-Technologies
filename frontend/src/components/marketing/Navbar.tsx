'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, CloudIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';

const links = [
  { href: '#build', label: 'Build a server' },
  { href: '#plans', label: 'Plans' },
  { href: '#why', label: 'Why us' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 rounded-lg font-display text-lg font-medium tracking-tight text-ink ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-fg">
        <CloudIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
      </span>
      KB Cloud Technologies
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const openPalette = () =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-surface-2 hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs text-ink-muted transition hover:bg-surface-2 lg:inline-flex"
            aria-label="Open command palette"
          >
            Search
            <kbd className="rounded bg-surface-2 px-1.5 py-0.5 font-sans text-[11px] text-ink-soft">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <Button href="/auth/login" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button href="/auth/register" className="hidden sm:inline-flex">
            Get started
          </Button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface text-ink-soft lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <XMarkIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="animate-fade-up border-t border-border bg-bg px-5 pb-5 pt-2 lg:hidden">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-2 text-ink hover:bg-surface-2"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button href="/auth/login" variant="secondary">
              Sign in
            </Button>
            <Button href="/auth/register">Get started</Button>
          </div>
        </div>
      )}
    </header>
  );
}
