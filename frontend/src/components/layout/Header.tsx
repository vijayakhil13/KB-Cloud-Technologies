'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu } from '@headlessui/react';
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { usePalette } from '@/components/ui/CommandPalette';
import { authService } from '@/lib/api/authService';
import { useFleet } from '@/lib/mock/store';
import { cn } from '@/lib/cn';
import { useCurrentUser } from './RequireAuth';
import { Logo } from './Sidebar';

/** Dashboard header: palette trigger, theme toggle, alerts bell and the signed-in user menu. */
export default function Header() {
  const user = useCurrentUser();
  const router = useRouter();
  const { setOpen } = usePalette();
  const { alerts } = useFleet();
  const [loggingOut, setLoggingOut] = useState(false);

  const openCount = alerts.filter((a) => a.state === 'open' && a.severity !== 'ok').length;
  const fullName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email : 'Account';
  const initials = user
    ? (`${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` || user.email[0]).toUpperCase()
    : '?';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // the token is cleared in a finally block regardless
    }
    router.push('/auth/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-bg/80 backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-5 sm:px-8">
        <Logo compact className="md:hidden" />

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Search and commands"
            className="hidden h-10 items-center gap-2 rounded-pill border border-border bg-surface px-4 text-sm text-ink-muted transition hover:bg-surface-2 md:inline-flex"
          >
            <MagnifyingGlassIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />
            Search
            <kbd className="rounded-md bg-surface-2 px-1.5 py-0.5 text-xs text-ink-soft">Ctrl K</kbd>
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Search and commands"
            className="grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface text-ink-soft transition hover:bg-surface-2 md:hidden"
          >
            <MagnifyingGlassIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
          </button>

          <ThemeToggle />

          <Link
            href="/dashboard/alerts"
            aria-label={openCount ? `Alerts, ${openCount} open` : 'Alerts'}
            className="relative grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface text-ink-soft transition hover:bg-surface-2"
          >
            <BellIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
            {openCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-pill bg-crit-soft px-1 text-[11px] font-semibold tabular-nums text-crit ring-2 ring-bg"
              >
                {openCount}
              </span>
            )}
          </Link>

          <Menu as="div" className="relative">
            <Menu.Button
              aria-label="User menu"
              className="flex min-h-11 items-center gap-2 rounded-pill border border-border bg-surface py-1 pl-1 pr-3 transition hover:bg-surface-2"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary-ink">
                {initials}
              </span>
              <span className="hidden max-w-[10rem] truncate text-sm font-medium text-ink sm:block">{fullName}</span>
              <ChevronDownIcon className="hidden h-4 w-4 text-ink-muted sm:block" width={16} height={16} aria-hidden="true" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-60 rounded-xl border border-border bg-surface p-1 shadow-lift focus:outline-none">
              <div className="border-b border-border px-3 py-2">
                <p className="truncate text-sm font-medium text-ink">{fullName}</p>
                {user?.email && <p className="truncate text-xs text-ink-muted">{user.email}</p>}
              </div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className={cn(
                      'mt-1 flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm text-ink disabled:opacity-60',
                      active && 'bg-primary-soft',
                    )}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />
                    {loggingOut ? 'Signing out...' : 'Log out'}
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
}
