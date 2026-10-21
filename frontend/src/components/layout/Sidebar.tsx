'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from '@headlessui/react';
import {
  BanknotesIcon,
  BellAlertIcon,
  ChartBarIcon,
  CloudIcon,
  EllipsisHorizontalIcon,
  LifebuoyIcon,
  PlusCircleIcon,
  ServerStackIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { useFleet } from '@/lib/mock/store';
import { cn } from '@/lib/cn';

interface NavItem {
  label: string;
  href: string;
  icon: typeof Squares2X2Icon;
  badge?: boolean;
}

export const NAV: NavItem[] = [
  { label: 'Fleet', href: '/dashboard', icon: Squares2X2Icon },
  { label: 'Deploy', href: '/dashboard/deploy', icon: PlusCircleIcon },
  { label: 'Alerts', href: '/dashboard/alerts', icon: BellAlertIcon, badge: true },
  { label: 'Monitoring', href: '/dashboard/monitoring', icon: ChartBarIcon },
  { label: 'Servers', href: '/dashboard/vms', icon: ServerStackIcon },
  { label: 'Billing', href: '/dashboard/billing', icon: BanknotesIcon },
  { label: 'Support', href: '/dashboard/support', icon: LifebuoyIcon },
];

const TABS = NAV.slice(0, 4);
const MORE = NAV.slice(4);

function useActive() {
  const pathname = usePathname();
  return (href: string) => (href === '/dashboard' ? pathname === href : pathname.startsWith(href));
}

function useOpenAlerts(): number {
  const { alerts } = useFleet();
  return alerts.filter((a) => a.state === 'open' && a.severity !== 'ok').length;
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/dashboard"
      className={cn('flex items-center gap-2.5 rounded-lg font-display text-lg font-medium text-ink', className)}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-fg">
        <CloudIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
      </span>
      <span className={compact ? 'sr-only sm:not-sr-only' : undefined}>KB Cloud Technologies</span>
    </Link>
  );
}

export default function Sidebar() {
  const isActive = useActive();
  const open = useOpenAlerts();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 md:flex">
        <Logo className="px-2" />
        <nav aria-label="Dashboard" className="mt-8 flex-1 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition',
                  active ? 'bg-primary-soft text-primary-ink' : 'text-ink-soft hover:bg-surface-2',
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" width={20} height={20} aria-hidden="true" />
                {item.label}
                {item.badge && open > 0 && (
                  <span className="ml-auto rounded-pill bg-crit-soft px-2 py-0.5 text-xs font-semibold tabular-nums text-crit">
                    <span className="sr-only">{open} open </span>
                    <span aria-hidden="true">{open}</span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <p className="px-2 text-xs text-ink-muted">KB Cloud Technologies</p>
      </aside>

      <nav
        aria-label="Dashboard"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {TABS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium',
                active ? 'text-primary-ink' : 'text-ink-soft',
              )}
            >
              <item.icon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
              {item.label}
              {item.badge && open > 0 && (
                <span className="absolute right-3 top-1.5 grid h-4 min-w-4 place-items-center rounded-pill bg-crit-soft px-1 text-[10px] font-semibold tabular-nums text-crit">
                  <span className="sr-only">{open} open </span>
                  <span aria-hidden="true">{open}</span>
                </span>
              )}
            </Link>
          );
        })}
        <Menu as="div" className="relative flex">
          <Menu.Button className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium text-ink-soft">
            <EllipsisHorizontalIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
            More
          </Menu.Button>
          <Menu.Items className="absolute bottom-full right-1 mb-2 w-44 rounded-xl border border-border bg-surface p-1 shadow-lift focus:outline-none">
            {MORE.map((item) => (
              <Menu.Item key={item.href}>
                {({ active }) => (
                  <Link
                    href={item.href}
                    className={cn('flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-ink', active && 'bg-primary-soft')}
                  >
                    <item.icon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
                    {item.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </nav>
    </>
  );
}
