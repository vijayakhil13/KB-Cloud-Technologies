import { BoltIcon, CircleStackIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/components/dashboard/PageHeader';
import UsageCard from '@/components/dashboard/UsageCard';
import ResourceChart from '@/components/dashboard/ResourceChart';

/**
 * Placeholder data — swap with the metrics API later.
 */
const usage = {
  cpu: { percent: 28, caption: 'of 4 vCPU cores' },
  ram: { percent: 62, caption: '5 GB of 8 GB' },
  storage: { percent: 45, caption: '112 GB of 250 GB' },
};

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring"
        subtitle="Track CPU, RAM and storage for Windows-Server-01"
      />

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

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Resource Usage{' '}
          <span className="font-normal text-gray-400">(Last 24 Hours)</span>
        </h2>
        <div className="mt-4">
          <ResourceChart height={320} />
        </div>
      </div>
    </div>
  );
}
