'use client';

import { useId } from 'react';
import type { CSSProperties } from 'react';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  marks?: number[];
  onChange: (v: number) => void;
  format?: (v: number) => string;
  className?: string;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  marks,
  onChange,
  format,
  className,
}: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  const text = format ? format(value) : `${value}${unit ? ` ${unit}` : ''}`;
  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <output
          htmlFor={id}
          className="rounded-pill bg-surface-2 px-3 py-1 text-sm font-medium tabular-nums text-ink"
        >
          {text}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pct': `${pct}%` } as CSSProperties}
        className="kb-range block h-6 w-full cursor-pointer appearance-none bg-transparent"
      />
      {marks && marks.length > 0 && (
        <div className="relative mt-1 h-5 text-xs tabular-nums text-ink-muted" aria-hidden="true">
          {marks.map((m) => {
            const p = ((m - min) / (max - min)) * 100;
            return (
              <span
                key={m}
                className="absolute -translate-x-1/2"
                style={{ left: `calc(${p}% + ${12 - (p / 100) * 24}px)` }}
              >
                {m}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
export { Slider };
