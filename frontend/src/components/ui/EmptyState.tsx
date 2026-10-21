import Illustration from './Illustration';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  illustration?: 'hills' | 'clouds' | 'rack';
  className?: string;
}

export default function EmptyState({
  title,
  description,
  action,
  illustration = 'hills',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-card border border-dashed border-border bg-surface px-6 py-10 text-center',
        className
      )}
    >
      <Illustration name={illustration} className="mb-5 h-28 w-48 max-w-full" />
      <h3 className="font-display text-xl font-medium text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
export { EmptyState };
