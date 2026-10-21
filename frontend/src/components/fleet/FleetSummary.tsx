import { BanknotesIcon, BellAlertIcon, ServerStackIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import { formatINR } from '@/lib/pricing';
import type { Alert, Server } from '@/lib/mock/types';

export default function FleetSummary({ servers, alerts }: { servers: Server[]; alerts: Alert[] }) {
  const active = servers.filter((s) => s.status !== 'stopped');
  const spend = active.reduce((n, s) => n + s.priceInrMonth, 0);
  const open = alerts.filter((a) => a.state === 'open' && a.severity !== 'ok').length;
  const items = [
    { label: 'Servers running', value: `${active.length} of ${servers.length}`, icon: ServerStackIcon },
    { label: 'Monthly spend', value: formatINR(spend), icon: BanknotesIcon },
    { label: 'Open alerts', value: String(open), icon: BellAlertIcon },
  ];
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <Card key={it.label} padding="sm" className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-ink">
            <it.icon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
          </span>
          <div>
            <dt className="text-sm text-ink-soft">{it.label}</dt>
            <dd className="font-display text-2xl font-medium tabular-nums text-ink">{it.value}</dd>
          </div>
        </Card>
      ))}
    </dl>
  );
}
