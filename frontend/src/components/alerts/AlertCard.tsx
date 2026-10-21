'use client';

import Link from 'next/link';
import { Menu } from '@headlessui/react';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatTime, relativeTime } from '@/lib/mock/derive';
import type { Alert, AlertSeverity, AlertState, SnoozeDuration } from '@/lib/mock/types';
import { cn } from '@/lib/cn';

export interface AlertCardProps {
  alert: Alert;
  serverName: string;
  busy?: boolean;
  onAck: () => void;
  onSnooze: (d: SnoozeDuration) => void;
  onResolve: () => void;
}

const SEVERITY = {
  crit: { label: 'Critical', tone: 'crit', rail: 'border-crit', icon: ExclamationCircleIcon },
  warn: { label: 'Warning', tone: 'warn', rail: 'border-warn', icon: ExclamationTriangleIcon },
  ok: { label: 'Info', tone: 'ok', rail: 'border-ok', icon: CheckCircleIcon },
} as const satisfies Record<AlertSeverity, unknown>;

const STATE_LABEL: Record<AlertState, string> = {
  open: 'Open',
  acknowledged: 'Acknowledged',
  snoozed: 'Snoozed',
  resolved: 'Resolved',
};

const itemClass = (active: boolean) =>
  cn('flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm text-ink', active && 'bg-primary-soft');

export default function AlertCard({ alert, serverName, busy, onAck, onSnooze, onResolve }: AlertCardProps) {
  const sev = SEVERITY[alert.severity];
  const SevIcon = sev.icon;
  const canAck = alert.state === 'open';
  const canAct = alert.state !== 'resolved';
  const titleId = `alert-title-${alert.id}`;

  return (
    <Card as="li" aria-labelledby={titleId} aria-busy={busy || undefined} padding="sm" className={cn('border-l-4 sm:p-5', sev.rail)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          tone={sev.tone}
          icon={<SevIcon className="h-3.5 w-3.5" width={14} height={14} aria-hidden="true" />}
        >
          {sev.label}
        </Badge>
        <Badge tone="neutral">{STATE_LABEL[alert.state]}</Badge>
        <time dateTime={alert.createdAt} className="ml-auto text-xs text-ink-muted">
          {relativeTime(alert.createdAt)}
        </time>
      </div>
      <h3 id={titleId} className="mt-3 font-medium text-ink">
        {alert.title}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{alert.detail}</p>
      <p className="mt-2 text-sm text-ink-muted">
        Server:{' '}
        <Link href={`/dashboard#server-${alert.serverId}`} className="font-medium text-primary-ink underline underline-offset-2">
          {serverName}
        </Link>
        {alert.state === 'snoozed' && alert.snoozedUntil && <> · Snoozed until {formatTime(alert.snoozedUntil)}</>}
      </p>

      {canAct && (
        <>
          <div className="mt-4 hidden flex-wrap items-center gap-2 sm:flex">
            {canAck && (
              <Button size="sm" variant="secondary" disabled={busy} onClick={onAck} aria-label={`Acknowledge ${alert.title}`}>
                Acknowledge
              </Button>
            )}
            <Menu as="div" className="relative">
              <Menu.Button
                disabled={busy}
                aria-label={`Snooze ${alert.title}`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 text-sm font-medium text-ink hover:bg-surface-2 disabled:opacity-50"
              >
                Snooze
                <ChevronDownIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />
              </Menu.Button>
              <Menu.Items className="absolute left-0 z-10 mt-1 w-36 rounded-xl border border-border bg-surface p-1 shadow-lift focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button type="button" className={itemClass(active)} onClick={() => onSnooze('1h')}>
                      1 hour
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button type="button" className={itemClass(active)} onClick={() => onSnooze('24h')}>
                      24 hours
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
            <Button size="sm" disabled={busy} onClick={onResolve} aria-label={`Resolve ${alert.title}`}>
              Resolve
            </Button>
          </div>

          <Menu as="div" className="relative mt-4 sm:hidden">
            <Menu.Button
              disabled={busy}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-medium text-ink disabled:opacity-50"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
              Actions
              <span className="sr-only"> for {alert.title}</span>
            </Menu.Button>
            <Menu.Items className="absolute inset-x-0 bottom-full z-10 mb-1 rounded-xl border border-border bg-surface p-1 shadow-lift focus:outline-none">
              {canAck && (
                <Menu.Item>
                  {({ active }) => (
                    <button type="button" className={itemClass(active)} onClick={onAck}>
                      Acknowledge
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={itemClass(active)} onClick={() => onSnooze('1h')}>
                    Snooze 1 hour
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={itemClass(active)} onClick={() => onSnooze('24h')}>
                    Snooze 24 hours
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={itemClass(active)} onClick={onResolve}>
                    Resolve
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </>
      )}
    </Card>
  );
}
