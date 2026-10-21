import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * Page-agnostic dashboard header: notification bell + user block.
 * Static placeholder user — swap for the authenticated user later.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
      <div className="flex h-16 items-center justify-end gap-2 px-4 sm:px-6 lg:px-8">
        {/* Notifications */}
        <button
          type="button"
          title="Notifications"
          className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6ef5]"
        >
          <BellIcon className="h-6 w-6" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            2
          </span>
        </button>

        {/* User block */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl py-1.5 pl-1.5 pr-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6ef5]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#1a6ef5]">
            RK
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-gray-900">
              Ramesh Kumar
            </span>
            <span className="block text-xs text-gray-400">Client</span>
          </span>
          <ChevronDownIcon className="hidden h-4 w-4 text-gray-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
