import { forwardRef, useId } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className, wrapperClassName, id, children, ...rest },
  ref
) {
  const auto = useId();
  const sid = id ?? auto;
  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={sid} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={sid}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-lg border bg-surface pl-3.5 pr-10 text-ink transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
            error ? 'border-crit' : 'border-border',
            className
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
          width={20}
          height={20}
          aria-hidden="true"
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-crit">{error}</p>}
    </div>
  );
});

export default Select;
export { Select };
