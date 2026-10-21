import { CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/cn';

export interface StepperProps {
  steps: { id: string; label: string }[];
  /** zero-based index of the current step */
  current: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export default function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  const pct = ((current + 1) / steps.length) * 100;
  return (
    <nav aria-label="Progress" className={className}>
      {/* Mobile: compact text + bar */}
      <div className="sm:hidden">
        <p className="text-sm font-medium text-ink">
          Step {current + 1} of {steps.length} <span aria-hidden="true">·</span> {steps[current]?.label}
        </p>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-pill bg-surface-2"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={current + 1}
          aria-label="Wizard progress"
        >
          <div className="h-full rounded-pill bg-primary transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="hidden items-center sm:flex">
        {steps.map((s, i) => {
          const done = i < current;
          const isCurrent = i === current;
          const circle = (
            <span
              className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-medium tabular-nums',
                done && 'bg-primary text-primary-fg',
                isCurrent && 'border-2 border-primary text-primary-ink',
                !done && !isCurrent && 'border border-border text-ink-muted'
              )}
            >
              {done ? <CheckIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" /> : i + 1}
            </span>
          );
          const content = (
            <>
              {circle}
              <span className={cn('text-sm font-medium', isCurrent ? 'text-ink' : 'text-ink-soft')}>{s.label}</span>
            </>
          );
          return (
            <li key={s.id} aria-current={isCurrent ? 'step' : undefined} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
              {done && onStepClick ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  className="flex items-center gap-2.5 rounded-lg"
                  aria-label={`Go back to step ${i + 1}, ${s.label}`}
                >
                  {content}
                </button>
              ) : (
                <span className="flex items-center gap-2.5">{content}</span>
              )}
              {i < steps.length - 1 && (
                <span aria-hidden="true" className={cn('mx-4 h-0.5 flex-1 rounded-pill', done ? 'bg-primary' : 'bg-border')} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
export { Stepper };
