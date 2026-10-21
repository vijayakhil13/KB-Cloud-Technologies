import { PlusIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/components/dashboard/PageHeader';
import ServerInfoCard, {
  StatusBadge,
  WindowsMark,
} from '@/components/dashboard/ServerInfoCard';

/**
 * Placeholder data — swap with the VM list API later.
 */
const primaryServer = {
  name: 'Windows-Server-01',
  statusLabel: 'Running',
  ip: '103.221.41.45',
  uptime: '26 days',
  os: 'Windows Server 2022',
};

export default function VirtualMachinesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Server"
        subtitle="Manage your cloud servers and connect securely"
      />

      <ServerInfoCard server={primaryServer} />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Server Details
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'vCPU', value: '4 cores' },
            { label: 'RAM', value: '8 GB' },
            { label: 'Storage', value: '250 GB SSD' },
            { label: 'Region', value: 'Mumbai (IN)' },
          ].map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl bg-[#f5f8fc] px-4 py-3"
            >
              <dt className="text-xs text-gray-400">{spec.label}</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <WindowsMark className="h-8 w-8" />
          <StatusBadge label={primaryServer.statusLabel} />
          <span className="text-sm text-gray-500">
            Remote desktop (RDP) access is available via the Connect button
            above.
          </span>
        </div>
      </div>

      {/* Empty state for additional servers */}
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-gray-900">
          Need another server?
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          Additional servers you provision will appear here alongside
          Windows-Server-01.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1a6ef5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f57d0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6ef5] focus-visible:ring-offset-2"
        >
          <PlusIcon className="h-4 w-4" />
          New Server
        </button>
      </div>
    </div>
  );
}
