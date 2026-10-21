'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/components/dashboard/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { formatINR } from '@/lib/pricing';
import { OS_LABEL, REGION_LABEL } from '@/lib/mock/derive';
import { useFleet } from '@/lib/mock/store';
import type { Server } from '@/lib/mock/types';

const STATUS = {
  running: { tone: 'ok', label: 'Running' },
  stopped: { tone: 'neutral', label: 'Stopped' },
  restarting: { tone: 'warn', label: 'Restarting' },
} as const;

function specs(s: Server): [string, string][] {
  return [
    ['IP address', s.ip],
    ['Operating system', OS_LABEL[s.os]],
    ['vCPU', `${s.vcpu} cores`],
    ['RAM', `${s.ramGb} GB`],
    ['Storage', `${s.storageGb} GB SSD`],
    ['Region', REGION_LABEL[s.region]],
    ['Price', `${formatINR(s.priceInrMonth)}/month`],
    ['Created', new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
  ];
}

export default function ServersPage() {
  const { servers, status, reload } = useFleet();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servers"
        subtitle="Details for every server on your account."
        actions={
          <Button href="/dashboard/deploy" leftIcon={<PlusIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />}>
            Deploy a server
          </Button>
        }
      />

      {status === 'loading' && (
        <div aria-busy="true" aria-label="Loading servers" className="space-y-6">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-56 rounded-card" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <Card role="alert" className="flex flex-wrap items-center justify-between gap-4 !border-crit/30 !bg-crit-soft">
          <p className="font-medium text-crit">Could not load your servers</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}

      {status === 'ready' && servers.length === 0 && (
        <EmptyState
          title="No servers yet"
          description="Your first one takes about a minute."
          action={<Button href="/dashboard/deploy">Deploy a server</Button>}
        />
      )}

      {status === 'ready' &&
        servers.map((s) => (
          <Card key={s.id} as="article" id={`server-${s.id}`} aria-labelledby={`vm-${s.id}`} tabIndex={-1} className="scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id={`vm-${s.id}`} className="font-display text-xl font-medium text-ink">
                {s.name}
              </h2>
              <div className="flex items-center gap-3">
                <Badge tone={STATUS[s.status].tone} dot>
                  {STATUS[s.status].label}
                </Badge>
                <Button size="sm" variant="secondary" href={`/dashboard/monitoring?server=${s.id}`}>
                  Monitoring
                </Button>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {specs(s).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-surface-2 px-4 py-3">
                  <dt className="text-xs text-ink-muted">{k}</dt>
                  <dd className="mt-1 text-sm font-medium tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
    </div>
  );
}
