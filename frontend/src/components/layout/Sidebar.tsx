import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="px-4 pt-5">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-600">
            {/* Dashboard icon */}
          </div>
          <span className="font-medium text-gray-900">Dashboard</span>
        </Link>
      </div>
      <div className="mt-10 px-4">
        <Link
          href="/dashboard/vms"
          className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
        >
          Virtual Machines
        </Link>
        <Link
          href="/dashboard/monitoring"
          className="mt-1 group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
        >
          Monitoring
        </Link>
        <Link
          href="/dashboard/alerts"
          className="mt-1 group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
        >
          Alerts
        </Link>
        <Link
          href="/dashboard/billing"
          className="mt-1 group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
        >
          Billing
        </Link>
        <Link
          href="/dashboard/support"
          className="mt-1 group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
        >
          Support
        </Link>
      </div>
    </aside>
  );
}