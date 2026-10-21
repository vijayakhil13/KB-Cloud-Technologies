'use client';

import { BanknotesIcon, ClockIcon, DocumentTextIcon, ServerStackIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/components/dashboard/PageHeader';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { formatINR } from '@/lib/pricing';
import { OS_LABEL, REGION_LABEL } from '@/lib/mock/derive';
import { useFleet } from '@/lib/mock/store';

const HOURS_PER_MONTH = 730;

export default function BillingPage() {
  const { servers, status } = useFleet();
  const billed = servers.filter((s) => s.status !== 'stopped');
  const total = billed.reduce((n, s) => n + s.priceInrMonth, 0);
  const storage = servers.reduce((n, s) => n + s.storageGb, 0);
  const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const stats = [
    { label: 'Estimated this month', value: formatINR(total), caption: `For ${month}, running servers only`, icon: BanknotesIcon },
    { label: 'Hourly rate', value: formatINR(total / HOURS_PER_MONTH), caption: `Across ${billed.length} running server${billed.length === 1 ? '' : 's'}`, icon: ClockIcon },
    { label: 'Storage', value: `${storage} GB`, caption: `Provisioned across ${servers.length} server${servers.length === 1 ? '' : 's'}`, icon: ServerStackIcon },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" subtitle="What you are using and what it costs." />

      {status === 'loading' ? (
        <div aria-busy="true" aria-label="Loading billing" className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36 rounded-card" />
          ))}
        </div>
      ) : (
        <dl className="grid gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary-ink">
                  <s.icon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
                </span>
                <dt className="text-sm font-medium text-ink-soft">{s.label}</dt>
              </div>
              <dd className="mt-4 font-display text-3xl font-medium tabular-nums text-ink">{s.value}</dd>
              <p className="mt-1 text-sm text-ink-muted">{s.caption}</p>
            </Card>
          ))}
        </dl>
      )}

      {status === 'ready' && servers.length > 0 && (
        <Card as="section" aria-labelledby="by-server">
          <h2 id="by-server" className="font-display text-xl font-medium text-ink">
            By server
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {servers.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                <div>
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="text-sm text-ink-muted">
                    {s.vcpu} vCPU · {s.ramGb} GB · {s.storageGb} GB · {OS_LABEL[s.os]} · {REGION_LABEL[s.region]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {s.status === 'stopped' && <Badge tone="neutral">Stopped, not billed for compute</Badge>}
                  <span className="font-medium tabular-nums text-ink">{formatINR(s.priceInrMonth)}/mo</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card as="section" aria-labelledby="invoices">
        <h2 id="invoices" className="font-display text-xl font-medium text-ink">
          Invoice history
        </h2>
        <div className="flex flex-col items-center py-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-ink-muted">
            <DocumentTextIcon className="h-6 w-6" width={24} height={24} aria-hidden="true" />
          </span>
          <p className="mt-4 font-medium text-ink">No invoices yet</p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            Invoices from KB Cloud Technologies appear here after your first billing cycle completes.
          </p>
        </div>
      </Card>
    </div>
  );
}
