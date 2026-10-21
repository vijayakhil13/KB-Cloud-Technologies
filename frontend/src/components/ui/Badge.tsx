import { cn } from '@/lib/cn';

export type BadgeTone = 'ok' | 'warn' | 'crit' | 'info' | 'neutral';

const tones: Record<BadgeTone, { box: string; dot: string }> = {
  ok: { box: 'bg-ok-soft text-ok', dot: 'bg-ok' },
  warn: { box: 'bg-warn-soft text-warn', dot: 'bg-warn' },
  crit: { box: 'bg-crit-soft text-crit', dot: 'bg-crit' },
  info: { box: 'bg-primary-soft text-primary-ink', dot: 'bg-primary' },
  neutral: { box: 'bg-surface-2 text-ink-soft', dot: 'bg-ink-muted' },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  dot?: boolean;
  /** sand highlight, e.g. "Most chosen" */
  accent?: boolean;
}

export default function Badge({ tone = 'neutral', icon, dot, accent, className, children, ...rest }: BadgeProps) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium',
        accent ? 'bg-accent-soft text-accent-ink' : t.box,
        className
      )}
      {...rest}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} aria-hidden="true" />}
      {icon}
      {children}
    </span>
  );
}
export { Badge };
