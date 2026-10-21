'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth/useAuth';
import { authService } from '@/lib/api/authService';

/**
 * Dashboard header: mobile menu toggle, notification bell and user menu with logout.
 */
export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fullName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email
    : 'Account';
  const initials = user
    ? (
        `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` ||
        user.email[0]
      ).toUpperCase()
    : '?';

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // token is cleared in a finally block regardless
    }
    router.push('/auth/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
      <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          aria-controls="dashboard-sidebar"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/dashboard/alerts"
            aria-label="Notifications, 2 unread"
            className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              2
            </span>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="User menu"
              className="flex items-center gap-3 rounded-xl py-1.5 pl-1.5 pr-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block max-w-[10rem] truncate text-sm font-semibold text-gray-900">
                  {fullName}
                </span>
                <span className="block text-xs capitalize text-gray-400">
                  {user?.role?.toLowerCase() ?? 'client'}
                </span>
              </span>
              <ChevronDownIcon
                className="hidden h-4 w-4 text-gray-400 sm:block"
                aria-hidden="true"
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-1 shadow-lg"
              >
                <div className="border-b border-gray-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {fullName}
                  </p>
                  {user?.email ? (
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                  {loggingOut ? 'Signing out…' : 'Log out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
