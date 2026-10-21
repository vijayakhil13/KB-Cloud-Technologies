'use client';

import { useRef } from 'react';
import { cn } from '@/lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (v: T) => void;
  className?: string;
}

export default function Segmented<T extends string>({ label, value, options, onChange, className }: SegmentedProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const move = (i: number) => {
    const n = (i + options.length) % options.length;
    onChange(options[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('inline-flex rounded-pill border border-border bg-surface-2 p-1', className)}
    >
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                move(i + 1);
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                move(i - 1);
              }
            }}
            className={cn(
              'inline-flex min-h-9 items-center gap-2 rounded-pill px-4 text-sm font-medium transition',
              on ? 'bg-surface text-ink shadow-soft' : 'text-ink-soft hover:text-ink'
            )}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
export { Segmented };
