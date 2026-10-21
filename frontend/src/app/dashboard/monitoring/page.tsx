'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/dashboard/PageHeader';
import UsageTrend from '@/components/dashboard/UsageTrend';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import { storageForecast } from '@/lib/pricing';
import { useFleet } from '@/lib/mock/store';

export default function MonitoringPage() {
  const { servers, status, reload } = useFleet();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(new URLSearchParams(window.location.search).get('server'));
  }, []);

  const server = servers.find((s) => s.id === selected) ?? servers[0];
  const forecast = server ? storageForecast(server.storageGb, server.storageUsedGb, server.storageGrowthGbPerDay) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring"
        subtitle={server ? `CPU, RAM and storage for ${server.name}` : 'CPU, RAM and storage for your servers'}
        actions={
          servers.length > 1 && (
            <Select
              label="Server"
              wrapperClassName="min-w-48"
              value={server?.id}
              onChange={(e) => setSelected(e.target.value)}
            >
              {servers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          )
        }
      />

      {status === 'loading' && (
        <div aria-busy="true" aria-label="Loading metrics" className="space-y-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 rounded-card" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <Card role="alert" className="flex flex-wrap items-center justify-between gap-4 !border-crit/30 !bg-crit-soft">
          <p className="font-medium text-crit">Could not load metrics</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}

      {status === 'ready' && !server && (
        <EmptyState
          title="Nothing to monitor yet"
          description="Deploy a server and its usage shows up here."
          action={<Button href="/dashboard/deploy">Deploy a server</Button>}
        />
      )}

      {status === 'ready' && server && forecast && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <UsageTrend label="CPU" data={server.usage.cpu} />
            <UsageTrend label="RAM" data={server.usage.ram} />
          </div>
          <UsageTrend label="Storage" data={server.usage.storage} />
          <Card tone="tint">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">Capacity forecast</p>
            <p className="mt-2 font-display text-2xl font-medium text-ink">{forecast.text}</p>
            <p className="mt-1 text-sm text-ink-soft">
              {server.storageUsedGb} GB of {server.storageGb} GB used, growing about {server.storageGrowthGbPerDay} GB a day.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
