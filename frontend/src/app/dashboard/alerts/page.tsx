import PageHeader from '@/components/dashboard/PageHeader';

type AlertStatus = 'Critical' | 'Warning' | 'Resolved';

type AlertRow = {
  id: number;
  time: string;
  server: string;
  type: string;
  message: string;
  status: AlertStatus;
};

/**
 * Placeholder data — swap with the alerts API later.
 */
const alerts: AlertRow[] = [
  {
    id: 1,
    time: '2026-06-10 14:25',
    server: 'Win-Server-01',
    type: 'High CPU',
    message: 'CPU usage above 90% for 5 minutes',
    status: 'Critical',
  },
  {
    id: 2,
    time: '2026-06-10 13:40',
    server: 'Linux-Server-03',
    type: 'High Disk',
    message: 'Disk usage above 85%',
    status: 'Warning',
  },
  {
    id: 3,
    time: '2026-06-10 12:15',
    server: 'Host Server',
    type: 'High RAM',
    message: 'Memory usage above 80%',
    status: 'Warning',
  },
  {
    id: 4,
    time: '2026-06-10 11:10',
    server: 'Win-Server-01',
    type: 'High CPU',
    message: 'CPU usage reached 92%',
    status: 'Critical',
  },
  {
    id: 5,
    time: '2026-06-10 10:45',
    server: 'Win-Server-01',
    type: 'Recovered',
    message: 'CPU usage back to normal',
    status: 'Resolved',
  },
];

const statusChip: Record<AlertStatus, string> = {
  Critical: 'bg-red-50 text-red-600',
  Warning: 'bg-amber-50 text-amber-600',
  Resolved: 'bg-green-50 text-green-600',
};

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        subtitle="Recent alerts across your servers"
      />

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-base font-semibold text-gray-900">
            Alert History
          </h2>
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Mark all as read
          </button>
        </div>

        <div className="overflow-x-auto px-6 pb-6 pt-4">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-gray-400">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Server</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Message</th>
                <th className="pb-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-3.5 text-gray-500">
                    {alert.time}
                  </td>
                  <td className="whitespace-nowrap py-3.5 font-medium text-gray-900">
                    {alert.server}
                  </td>
                  <td className="whitespace-nowrap py-3.5 text-gray-700">
                    {alert.type}
                  </td>
                  <td className="py-3.5 text-gray-500">{alert.message}</td>
                  <td className="whitespace-nowrap py-3.5 text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusChip[alert.status]}`}
                    >
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
