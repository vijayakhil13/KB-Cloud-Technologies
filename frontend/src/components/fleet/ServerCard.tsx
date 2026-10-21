'use client';

import Link from 'next/link';
import { Menu } from '@headlessui/react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import Button, { Spinner } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import RingGauge from '@/components/ui/RingGauge';
import Sparkline from '@/components/ui/Sparkline';
import type { SparklineTone } from '@/components/ui/Sparkline';
import { storageForecast } from '@/lib/pricing';
import { REGION_LABEL, avg, healthScore, last, peak } from '@/lib/mock/derive';
import type { Alert, PowerAction, Server } from '@/lib/mock/types';
import { cn } from '@/lib/cn';

export interface ServerCardProps {
  server: Server;
  alerts: Alert[];
  onPower: (action: PowerAction) => void;
  busyAction?: PowerAction;
  highlight?: boolean;
}

const STATUS = {
  running: { tone: 'ok', label: 'Running' },
  stopped: { tone: 'neutral', label: 'Stopped' },
  restarting: { tone: 'warn', label: 'Restarting' },
} as const;

function usageTone(latest: number, dim: boolean): SparklineTone {
  if (dim) return 'muted';
  return latest >= 85 ? 'crit' : latest >= 70 ? 'warn' : 'primary';
}

export default function ServerCard({ server, alerts, onPower, busyAction, highlight }: ServerCardProps) {
  const status = STATUS[server.status];
  const stopped = server.status === 'stopped';
  const busy = busyAction !== undefined || server.status === 'restarting';
  const score = stopped ? null : healthScore(server, alerts);
  const forecast = storageForecast(server.storageGb, server.storageUsedGb, server.storageGrowthGbPerDay);
  const ForecastIcon = forecast.tone === 'ok' ? CheckCircleIcon : ExclamationTriangleIcon;
  const titleId = `server-title-${server.id}`;
  const rows = [
    { label: 'CPU', data: server.usage.cpu },
    { label: 'RAM', data: server.usage.ram },
    { label: 'Storage', data: server.usage.storage },
  ];

  return (
    <Card
      as="article"
      interactive
      id={`server-${server.id}`}
      aria-labelledby={titleId}
      aria-busy={busy || undefined}
      tabIndex={-1}
      className={cn('flex scroll-mt-24 flex-col', highlight && 'ring-2 ring-primary')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 id={titleId} className="truncate font-medium text-ink">
            {server.name}
          </h3>
          <div className="mt-1.5">
            <Badge
              tone={status.tone}
              dot={server.status !== 'restarting'}
              icon={server.status === 'restarting' ? <Spinner className="h-3 w-3" /> : undefined}
            >
              {status.label}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            {server.vcpu} vCPU · {server.ramGb} GB · {server.storageGb} GB · {REGION_LABEL[server.region]}
          </p>
        </div>
        <RingGauge value={score} label={`${server.name} health score`} />
      </div>

      <ul className="mt-5 space-y-2.5">
        {rows.map((r) => {
          const now = last(r.data);
          return (
            <li key={r.label} className="flex items-center gap-3 text-sm">
              <span className="w-16 text-ink-soft">{r.label}</span>
              <Sparkline
                data={r.data}
                tone={usageTone(now, stopped)}
                width={120}
                height={28}
                ariaLabel={`${r.label} last 7 days, average ${avg(r.data)}%, peak ${peak(r.data)}%`}
              />
              <span className="ml-auto tabular-nums text-ink">{now}%</span>
            </li>
          );
        })}
      </ul>

      <p
        className={cn(
          'mt-4 flex items-center gap-2 text-sm',
          forecast.tone === 'crit' ? 'text-crit' : forecast.tone === 'warn' ? 'text-warn' : 'text-ink-soft',
        )}
      >
        <ForecastIcon className="h-4 w-4 shrink-0" width={16} height={16} aria-hidden="true" />
        {forecast.text}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<PlayIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />}
          disabled={server.status !== 'stopped' || busy}
          loading={busyAction === 'start'}
          aria-label={`Start ${server.name}`}
          onClick={() => onPower('start')}
        >
          Start
        </Button>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<StopIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />}
          disabled={server.status !== 'running' || busy}
          loading={busyAction === 'stop'}
          aria-label={`Stop ${server.name}`}
          onClick={() => onPower('stop')}
        >
          Stop
        </Button>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<ArrowPathIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />}
          disabled={server.status !== 'running' || busy}
          loading={busyAction === 'restart'}
          aria-label={`Restart ${server.name}`}
          onClick={() => onPower('restart')}
        >
          Restart
        </Button>
        <Menu as="div" className="relative ml-auto">
          <Menu.Button
            aria-label={`More options for ${server.name}`}
            className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-surface-2"
          >
            <EllipsisVerticalIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
          </Menu.Button>
          <Menu.Items className="absolute bottom-full right-0 z-10 mb-1 w-40 rounded-xl border border-border bg-surface p-1 shadow-lift focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/dashboard/vms#server-${server.id}`}
                  className={cn('flex min-h-11 items-center rounded-lg px-3 text-sm text-ink', active && 'bg-primary-soft')}
                >
                  Details
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/dashboard/monitoring?server=${server.id}`}
                  className={cn('flex min-h-11 items-center rounded-lg px-3 text-sm text-ink', active && 'bg-primary-soft')}
                >
                  Monitoring
                </Link>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </Card>
  );
}
