'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/cn';

export type ToastTone = 'ok' | 'warn' | 'crit' | 'info';

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  action?: { label: string; onClick: () => void };
  /** ms, default 4000 */
  duration?: number;
}

interface ToastItem extends ToastInput {
  id: number;
}

const Ctx = createContext<((t: ToastInput) => void) | null>(null);

const icons = { ok: CheckCircleIcon, warn: ExclamationTriangleIcon, crit: ExclamationTriangleIcon, info: InformationCircleIcon };
const iconTone: Record<ToastTone, string> = { ok: 'text-ok', warn: 'text-warn', crit: 'text-crit', info: 'text-primary' };

function ToastView({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  const tone = item.tone ?? 'info';
  const Icon = icons[tone];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(onClose, item.duration ?? 4000);
    return () => clearTimeout(t);
  }, [paused, item.duration, onClose]);

  return (
    <div
      role={tone === 'crit' ? 'alert' : 'status'}
      aria-live={tone === 'crit' ? 'assertive' : 'polite'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-float animate-pop-in"
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconTone[tone])} width={20} height={20} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{item.title}</p>
        {item.description && <p className="mt-0.5 text-sm text-ink-soft">{item.description}</p>}
        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action?.onClick();
              onClose();
            }}
            className="mt-2 min-h-9 rounded-lg text-sm font-semibold text-primary-ink underline underline-offset-2"
          >
            {item.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="-m-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-surface-2"
      >
        <XMarkIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const toast = useCallback((t: ToastInput) => {
    setItems((xs) => [...xs.slice(-3), { ...t, id: nextId.current++ }]);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setItems((xs) => xs.slice(0, -1));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => toast, [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-20 z-[60] flex flex-col gap-2 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-96 md:bottom-4">
        {items.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastView item={item} onClose={() => dismiss(item.id)} />
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): (t: ToastInput) => void {
  const toast = useContext(Ctx);
  if (!toast) throw new Error('useToast must be used inside <ToastProvider>');
  return toast;
}
