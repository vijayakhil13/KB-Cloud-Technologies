import { cn } from '@/lib/cn';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  count?: number;
}

export default function Chip({ pressed = false, count, className, children, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cn(
        'inline-flex min-h-9 shrink-0 items-center gap-2 rounded-pill border px-3.5 text-sm transition',
        pressed
          ? 'border-primary/40 bg-primary-soft font-medium text-primary-ink'
          : 'border-border bg-surface text-ink-soft hover:bg-surface-2',
        className
      )}
      {...rest}
    >
      {children}
      {count !== undefined && <span className="text-xs tabular-nums opacity-80">{count}</span>}
    </button>
  );
}
export { Chip };
