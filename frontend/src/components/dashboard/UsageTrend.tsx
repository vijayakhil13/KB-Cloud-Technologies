import Card from '@/components/ui/Card';
import { avg, last, peak } from '@/lib/mock/derive';

const W = 560;
const H = 180;
const PAD = { l: 36, r: 12, t: 12, b: 24 };

function dayLabels(n: number): string[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return d.toLocaleDateString('en-IN', { weekday: 'short' });
  });
}

/** 7-day usage line chart in plain SVG; colours follow the theme through currentColor. */
export default function UsageTrend({ label, data }: { label: string; data: number[] }) {
  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(data.length - 1, 1);
  const y = (v: number) => PAD.t + (1 - v / 100) * (H - PAD.t - PAD.b);
  const pts = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const days = dayLabels(data.length);
  const summary = `${label} last 7 days, average ${avg(data)}%, peak ${peak(data)}%`;

  return (
    <Card as="section" aria-label={label}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl font-medium text-ink">{label}</h2>
        <p className="font-display text-3xl font-medium tabular-nums text-ink">{last(data)}%</p>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Average {avg(data)}% · Peak {peak(data)}% over 7 days
      </p>
      <svg role="img" aria-label={summary} viewBox={`0 0 ${W} ${H}`} className="mt-4 h-auto w-full text-primary">
        {[0, 50, 100].map((g) => (
          <g key={g}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(g)} y2={y(g)} className="stroke-border" strokeWidth={1} />
            <text x={PAD.l - 8} y={y(g) + 4} textAnchor="end" className="fill-ink-muted text-[11px]">
              {g}%
            </text>
          </g>
        ))}
        <polygon points={`${x(0)},${y(0)} ${pts} ${x(data.length - 1)},${y(0)}`} fill="currentColor" opacity={0.1} />
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill="currentColor" />
        ))}
        {days.map((d, i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="fill-ink-muted text-[11px]">
            {d}
          </text>
        ))}
      </svg>
    </Card>
  );
}
