import { cn } from '@/lib/cn';

export type SparklineTone = 'primary' | 'ok' | 'warn' | 'crit' | 'muted';

const toneClass: Record<SparklineTone, string> = {
  primary: 'text-primary',
  ok: 'text-ok',
  warn: 'text-warn',
  crit: 'text-crit',
  muted: 'text-ink-muted',
};

export interface SparklineProps {
  data: number[];
  tone?: SparklineTone;
  height?: number;
  width?: number;
  ariaLabel: string;
  fill?: boolean;
  className?: string;
}

/** Inline SVG trend line; colour comes from currentColor so it follows the theme. */
export default function Sparkline({
  data,
  tone = 'primary',
  height = 32,
  width = 96,
  ariaLabel,
  fill = true,
  className,
}: SparklineProps) {
  const pad = 3;
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 1);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i * (width - pad * 2)) / Math.max(data.length - 1, 1);
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const lastPt = pts[pts.length - 1];
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('shrink-0', toneClass[tone], className)}
    >
      {fill && pts.length > 1 && (
        <polygon
          points={`${pad},${height - pad} ${line} ${width - pad},${height - pad}`}
          fill="currentColor"
          opacity={0.12}
        />
      )}
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {lastPt && <circle cx={lastPt[0]} cy={lastPt[1]} r={3} fill="currentColor" />}
    </svg>
  );
}
export { Sparkline };
