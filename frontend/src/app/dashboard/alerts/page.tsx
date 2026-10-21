'use client';

import { useEffect, useRef, useState } from 'react';
import AlertCard from '@/components/alerts/AlertCard';
import PageHeader from '@/components/dashboard/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Dialog from '@/components/ui/Dialog';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { useFleet } from '@/lib/mock/store';
import type { Alert, AlertSeverity, AlertState, SnoozeDuration } from '@/lib/mock/types';

type StateFilter = 'all' | AlertState;
type SeverityFilter = 'all' | Exclude<AlertSeverity, 'ok'>;
interface Filter {
  state: StateFilter;
  severity: SeverityFilter;
}

const FILTER_KEY = 'ch-alert-filter';
const STATE_CHIPS: { id: StateFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'acknowledged', label: 'Acknowledged' },
  { id: 'snoozed', label: 'Snoozed' },
  { id: 'resolved', label: 'Resolved' },
];
const SEVERITY_CHIPS: { id: Exclude<SeverityFilter, 'all'>; label: string }[] = [
  { id: 'crit', label: 'Critical' },
  { id: 'warn', label: 'Warning' },
];

const matches = (a: Alert, f: Filter) =>
  (f.state === 'all' || a.state === f.state) && (f.severity === 'all' || a.severity === f.severity);

export default function AlertsPage() {
  const { servers, alerts, status, reload, ackAlert, snoozeAlert, resolveAlert, reopenAlert, resolveAllAcknowledged } = useFleet();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>({ state: 'open', severity: 'all' });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const listHeading = useRef<HTMLHeadingElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FILTER_KEY) ?? 'null') as Partial<Filter> | null;
      if (saved?.state) setFilter({ state: saved.state, severity: saved.severity ?? 'all' });
    } catch {
      /* ignore a corrupt filter */
    }
  }, []);

  const choose = (patch: Partial<Filter>) => {
    const next = { ...filter, ...patch };
    setFilter(next);
    try {
      localStorage.setItem(FILTER_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const serverName = (id: string) => servers.find((s) => s.id === id)?.name ?? 'Unknown server';
  const count = (f: Filter) => alerts.filter((a) => matches(a, f)).length;
  const visible = alerts.filter((a) => matches(a, filter)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const ackCount = alerts.filter((a) => a.state === 'acknowledged').length;

  const act = async (a: Alert, run: () => Promise<void>, ok: string, undo = false) => {
    setBusyId(a.id);
    try {
      await run();
      toast({
        tone: 'ok',
        title: ok,
        duration: undo ? 5000 : 4000,
        action: undo
          ? { label: 'Undo', onClick: () => void reopenAlert(a.id) }
          : undefined,
      });
    } catch (e) {
      toast({ tone: 'crit', title: 'Could not update alert', description: e instanceof Error ? e.message : 'Please try again.' });
    } finally {
      setBusyId(null);
      listHeading.current?.focus();
    }
  };

  const emptyTitle = filter.state === 'open' ? 'All quiet. Nothing needs you right now.' : `No ${filter.state === 'all' ? '' : `${filter.state} `}alerts.`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        subtitle="Acknowledge, snooze or resolve what your servers report."
        actions={
          <Button variant="secondary" disabled={ackCount === 0} onClick={() => setConfirmAll(true)}>
            Resolve all acknowledged
          </Button>
        }
      />

      <div className="space-y-3">
        <div role="group" aria-label="Filter alerts by state" className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {STATE_CHIPS.map((c) => (
            <Chip
              key={c.id}
              pressed={filter.state === c.id}
              count={count({ state: c.id, severity: filter.severity })}
              onClick={() => choose({ state: c.id })}
              className="snap-start"
            >
              {c.label}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Filter alerts by severity" className="flex flex-wrap gap-2">
          {SEVERITY_CHIPS.map((c) => (
            <Chip
              key={c.id}
              pressed={filter.severity === c.id}
              count={count({ state: filter.state, severity: c.id })}
              onClick={() => choose({ severity: filter.severity === c.id ? 'all' : c.id })}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <h2 ref={listHeading} tabIndex={-1} className="sr-only focus:outline-none">
        Alert list, {visible.length} shown
      </h2>

      {status === 'loading' && (
        <div aria-busy="true" aria-label="Loading alerts" className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-card" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <Card role="alert" className="flex flex-wrap items-center justify-between gap-4 !border-crit/30 !bg-crit-soft">
          <p className="font-medium text-crit">Could not load your alerts</p>
          <Button variant="secondary" onClick={reload}>
            Retry
          </Button>
        </Card>
      )}

      {status === 'ready' && visible.length === 0 && <EmptyState title={emptyTitle} illustration="clouds" />}

      {status === 'ready' && visible.length > 0 && (
        <ul className="space-y-4">
          {visible.map((a) => (
            <AlertCard
              key={a.id}
              alert={a}
              serverName={serverName(a.serverId)}
              busy={busyId === a.id}
              onAck={() => void act(a, () => ackAlert(a.id), 'Alert acknowledged')}
              onSnooze={(d: SnoozeDuration) =>
                void act(a, () => snoozeAlert(a.id, d), `Alert snoozed for ${d === '1h' ? '1 hour' : '24 hours'}`)
              }
              onResolve={() => void act(a, () => resolveAlert(a.id), 'Alert resolved', true)}
            />
          ))}
        </ul>
      )}

      <Dialog
        open={confirmAll}
        onClose={() => setConfirmAll(false)}
        title="Resolve all acknowledged alerts?"
        description={`${ackCount} alert${ackCount === 1 ? '' : 's'} will move to Resolved.`}
        initialFocus={cancelRef}
        footer={
          <>
            <Button ref={cancelRef as React.Ref<HTMLButtonElement>} variant="secondary" onClick={() => setConfirmAll(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setConfirmAll(false);
                const n = await resolveAllAcknowledged();
                toast({ tone: 'ok', title: `${n} alert${n === 1 ? '' : 's'} resolved` });
                listHeading.current?.focus();
              }}
            >
              Resolve all
            </Button>
          </>
        }
      />
    </div>
  );
}
