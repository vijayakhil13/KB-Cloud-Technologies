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

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-[72px] shrink-0 bg-[#0b1626] transition-all duration-200 lg:w-64">
      <div className="flex h-full flex-col py-5">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-3 px-3 lg:justify-start lg:px-5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a6ef5]">
            <CloudIcon className="h-5 w-5 text-white" />
          </span>
          <span className="hidden text-lg font-semibold text-white lg:block">
            CloudHost
          </span>
        </Link>

        {/* Nav */}
        <nav className="mt-8 flex-1 space-y-1 px-2 lg:px-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                className={`group flex items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start ${
                  active
                    ? 'bg-[#1a6ef5] text-white shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5 shrink-0" />
                  {/* Collapsed-rail badge */}
                  {item.badge ? (
                    <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white lg:hidden">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                <span className="ml-3 hidden lg:block">{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto hidden rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white lg:inline-block">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <p className="mt-6 hidden px-5 text-[11px] leading-4 text-slate-500 lg:block">
          CloudHost
          <br />
          v1.0
        </p>
      </div>
    </aside>
  );
}
