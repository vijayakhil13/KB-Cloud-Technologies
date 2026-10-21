import { forwardRef, useId } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  /** element rendered inside the right edge (e.g. show/hide button) */
  trailing?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, trailing, className, wrapperClassName, id, 'aria-describedby': describedBy, ...rest },
  ref
) {
  const auto = useId();
  const inputId = id ?? auto;
  const errId = `${inputId}-err`;
  const hintId = `${inputId}-hint`;
  const desc =
    [describedBy, error ? errId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={desc}
          className={cn(
            'h-11 w-full rounded-lg border bg-surface px-3.5 text-ink placeholder:text-ink-muted transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-60',
            error ? 'border-crit' : 'border-border',
            trailing ? 'pr-12' : '',
            className
          )}
          {...rest}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="mt-1.5 flex items-start gap-1.5 text-sm text-crit">
          <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" width={16} height={16} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
export { Input };
