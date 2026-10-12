import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Cloud Hosting
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            {user ? (
              <>
                <Link
                  href="/dashboard/vms"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Virtual Machines
                </Link>
                <Link
                  href="/dashboard/monitoring"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Monitoring
                </Link>
                <Link
                  href="/dashboard/alerts"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Alerts
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="ml-4 text-gray-500 hover:text-gray-900"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              {/* Menu icon */}
            </button>
          </div>
          {user && (
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex-shrink-0">
                {/* User avatar placeholder */}
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-900">
                  {user?.firstName || 'User'}
                </div>
                <div className="text-sm text-gray-500">
                  {user?.email}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}