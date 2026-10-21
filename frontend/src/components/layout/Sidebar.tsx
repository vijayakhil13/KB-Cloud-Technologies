'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BellAlertIcon,
  ChartBarIcon,
  CloudIcon,
  ComputerDesktopIcon,
  QuestionMarkCircleIcon,
  ServerStackIcon,
  Squares2X2Icon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type NavItem = {
  label: string;
  href: string;
  icon: typeof Squares2X2Icon;
  badge?: number;
};

/**
 * Sidebar navigation. Remote Access and Monitoring both point at the
 * monitoring route until a dedicated remote-access page exists.
 */
const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
  { label: 'My Server', href: '/dashboard/vms', icon: ServerStackIcon },
  {
    label: 'Remote Access',
    href: '/dashboard/monitoring',
    icon: ComputerDesktopIcon,
  },
  { label: 'Monitoring', href: '/dashboard/monitoring', icon: ChartBarIcon },
  { label: 'Alerts', href: '/dashboard/alerts', icon: BellAlertIcon, badge: 2 },
  {
    label: 'Support',
    href: '/dashboard/support',
    icon: QuestionMarkCircleIcon,
  },
  { label: 'My Account', href: '/dashboard/billing', icon: UserCircleIcon },
];

export default function Sidebar({
  open = false,
  onClose = () => {},
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-navy/60 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="dashboard-sidebar"
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 bg-navy transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col py-5">
          {/* Logo */}
          <div className="flex items-center justify-between px-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand">
                <CloudIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold text-white">CloudHost</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:hidden"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Nav */}
          <nav
            aria-label="Dashboard"
            className="mt-8 flex-1 space-y-1 overflow-y-auto px-3"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    active
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="ml-3">{item.label}</span>
                  {item.badge ? (
                    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <p className="mt-6 px-5 text-[11px] leading-4 text-slate-500">
            CloudHost
            <br />
            v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
