import { cn } from '@/lib/cn';

export type RingTone = 'ok' | 'warn' | 'crit' | 'muted';

const toneClass: Record<RingTone, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  crit: 'text-crit',
  muted: 'text-ink-muted',
};

export interface RingGaugeProps {
  /** 0-100, or null to show an empty ring with a dash */
  value: number | null;
  size?: number;
  stroke?: number;
  label: string;
  /** defaults to health thresholds: >=80 ok, 50-79 warn, <50 crit */
  tone?: RingTone;
  className?: string;
}

export default function RingGauge({ value, size = 64, stroke = 7, label, tone, className }: RingGaugeProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  const t: RingTone = tone ?? (value === null ? 'muted' : v >= 80 ? 'ok' : v >= 50 ? 'warn' : 'crit');
  return (
    <div
      role="img"
      aria-label={value === null ? `${label} unavailable` : `${label} ${v} out of 100`}
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-surface-2" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          className={cn(toneClass[t], 'transition-[stroke-dashoffset] duration-[600ms] motion-reduce:transition-none')}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center font-display text-lg font-medium tabular-nums text-ink"
      >
        {value === null ? '-' : v}
      </span>
    </div>
  );
}
export { RingGauge };
