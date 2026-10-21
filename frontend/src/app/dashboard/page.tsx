import { BoltIcon, CircleStackIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/components/dashboard/PageHeader';
import ServerInfoCard from '@/components/dashboard/ServerInfoCard';
import UsageCard from '@/components/dashboard/UsageCard';
import ResourceChart from '@/components/dashboard/ResourceChart';
import AlertsList, { type AlertItem } from '@/components/dashboard/AlertsList';

/**
 * Placeholder data — swap with real API responses later.
 */
const server = {
  name: 'Windows-Server-01',
  statusLabel: 'Running',
  ip: '103.221.41.45',
  uptime: '26 days',
  os: 'Windows Server 2022',
};

const usage = {
  cpu: { percent: 28, caption: 'of 4 vCPU cores' },
  ram: { percent: 62, caption: '5 GB of 8 GB' },
  storage: { percent: 45, caption: '112 GB of 250 GB' },
};

const recentAlerts: AlertItem[] = [
  {
    id: 1,
    severity: 'warning',
    title: 'High RAM Usage',
    message: 'RAM usage reached 85%',
    time: 'Today 13:20',
  },
  {
    id: 2,
    severity: 'critical',
    title: 'High CPU Usage',
    message: 'CPU usage reached 92%',
    time: 'Today 11:10',
  },
  {
    id: 3,
    severity: 'info',
    title: 'Recovered',
    message: 'CPU usage back to normal',
    time: 'Today 10:45',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Dashboard"
        subtitle="Monitor your server and access it securely"
      />

      {/* Server info */}
      <ServerInfoCard server={server} />

      {/* Usage cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UsageCard
          icon={CpuChipIcon}
          iconTone="bg-green-50 text-green-600"
          label="CPU Usage"
          percent={usage.cpu.percent}
          color="green"
          caption={usage.cpu.caption}
        />
        <UsageCard
          icon={BoltIcon}
          iconTone="bg-amber-50 text-amber-500"
          label="RAM Usage"
          percent={usage.ram.percent}
          color="amber"
          caption={usage.ram.caption}
        />
        <UsageCard
          icon={CircleStackIcon}
          iconTone="bg-blue-50 text-[#1a6ef5]"
          label="Storage Usage"
          percent={usage.storage.percent}
          color="blue"
          caption={usage.storage.caption}
        />
      </div>

      {/* Chart + alerts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-base font-semibold text-gray-900">
            Resource Usage{' '}
            <span className="font-normal text-gray-400">(Last 24 Hours)</span>
          </h2>
          <div className="mt-4">
            <ResourceChart />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <AlertsList items={recentAlerts} />
        </div>
      </div>
    </div>
  );
}
