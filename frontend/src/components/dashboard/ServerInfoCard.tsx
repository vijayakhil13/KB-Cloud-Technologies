import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

/**
 * Four-square Windows mark rendered with divs.
 */
export function WindowsMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 grid-cols-2 gap-[3px] rounded-xl bg-blue-50 p-2.5 ${className}`}
      aria-hidden="true"
    >
      <span className="rounded-[2px] bg-[#1a6ef5]" />
      <span className="rounded-[2px] bg-[#1a6ef5]" />
      <span className="rounded-[2px] bg-[#1a6ef5]" />
      <span className="rounded-[2px] bg-[#1a6ef5]" />
    </span>
  );
}

/**
 * Green "Running" style status badge.
 */
export function StatusBadge({ label = 'Running' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
      <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
      {label}
    </span>
  );
}

export type ServerInfo = {
  name: string;
  statusLabel: string;
  ip: string;
  uptime: string;
  os: string;
};

/**
 * Server info card shown on the overview and My Server pages.
 * All values come from the `server` prop so real data can be swapped in.
 */
export default function ServerInfoCard({ server }: { server: ServerInfo }) {
  const stats = [
    { label: 'IP Address', value: server.ip },
    { label: 'Uptime', value: server.uptime },
    { label: 'OS', value: server.os },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <WindowsMark />
          <div>
            <p className="text-xs text-gray-400">My Server</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold text-gray-900">
                {server.name}
              </h2>
              <StatusBadge label={server.statusLabel} />
            </div>
          </div>
        </div>

        {/* Stats + action */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <dl className="grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-gray-400">{stat.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a6ef5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f57d0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6ef5] focus-visible:ring-offset-2"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
