'use client';

import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCurrentUser } from '@/components/layout/RequireAuth';
import ActivityTimeline from '@/components/fleet/ActivityTimeline';
import FleetSummary from '@/components/fleet/FleetSummary';
import ServerCard from '@/components/fleet/ServerCard';
import { usePower } from '@/components/fleet/usePower';
import PageHeader from '@/components/dashboard/PageHeader';
import { usePalette } from '@/components/ui/CommandPalette';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import { healthScore } from '@/lib/mock/derive';
import { useFleet } from '@/lib/mock/store';

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function FleetPage() {
  const user = useCurrentUser();
  const { servers, alerts, activity, status, reload } = useFleet();
  const { request, busy, dialog } = usePower();
  const { setOpen } = usePalette();
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [hello, setHello] = useState('Welcome');

  useEffect(() => setHello(greeting()), []);

  // New server from the deploy wizard: ?new=<id> highlights its card for 3 seconds.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('new');
    if (!id) return;
    setHighlightId(id);
    const t = setTimeout(() => setHighlightId(null), 3000);
    return () => clearTimeout(t);
  }, []);

  // Jump to a card from the palette (#server-<id>) once the fleet has loaded.
  useEffect(() => {
    if (status !== 'ready' || !window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    el?.scrollIntoView({ block: 'center' });
    el?.focus({ preventScroll: true });
  }, [status]);

  const attention = servers.filter((s) => s.status !== 'stopped' && healthScore(s, alerts) < 80).length;
  const healthy = servers.filter((s) => s.status === 'running').length - attention;
  const summary =
    status === 'ready' && servers.length > 0
      ? `${Math.max(healthy, 0)} of ${servers.length} servers healthy${attention ? ` · ${attention} needs attention` : ''}`
      : 'Your servers at a glance';

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${hello}${user?.firstName ? `, ${user.firstName}` : ''}`}
        subtitle={summary}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setOpen(true)}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />}
              className="hidden sm:inline-flex"
            >
              Search <kbd className="rounded-md bg-surface-2 px-1.5 py-0.5 text-xs text-ink-soft">Ctrl K</kbd>
            </Button>
            <Button href="/dashboard/deploy" leftIcon={<PlusIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />}>
              Deploy a server
            </Button>
          </>
        }
      />

      {status === 'loading' && (
        <div aria-busy="true" aria-label="Loading your fleet" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-80 rounded-card" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <Card role="alert" className="flex flex-wrap items-center justify-between gap-4 !border-crit/30 !bg-crit-soft">
          <p className="font-medium text-crit">Could not load your fleet</p>
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

      {status === 'ready' && servers.length > 0 && (
        <>
          <FleetSummary servers={servers} alerts={alerts} />
          <div className="grid gap-6 xl:grid-cols-[1fr_320px] xl:items-start">
            <section aria-label="Servers" className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {servers.map((s) => (
                <ServerCard
                  key={s.id}
                  server={s}
                  alerts={alerts}
                  busyAction={busy[s.id]}
                  highlight={highlightId === s.id}
                  onPower={(action) => request(s, action)}
                />
              ))}
            </section>
            <ActivityTimeline activity={activity} />
          </div>
        </>
      )}

      {dialog}
    </div>
  );
}
