import { cn } from '@/lib/cn';

export interface RadioCardProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/** Radio styled as a selectable card; the native input stays focusable but visually hidden. */
export default function RadioCard({ name, value, checked, onChange, title, description, icon, children }: RadioCardProps) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer gap-4 rounded-card border-2 p-5 transition focus-within:ring-2 focus-within:ring-ring/40',
        checked ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:bg-surface-2',
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {icon && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-surface-2 text-primary-ink">{icon}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{title}</span>
        {description && <span className="mt-0.5 block text-sm text-ink-soft">{description}</span>}
        {children}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2',
          checked ? 'border-primary bg-primary' : 'border-border',
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-primary-fg" />}
      </span>
    </label>
  );
}
