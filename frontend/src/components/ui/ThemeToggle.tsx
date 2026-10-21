'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/cn';

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const next = resolved === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className={cn(
        'grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface text-ink-soft transition hover:bg-surface-2',
        className
      )}
    >
      {resolved === 'dark' ? (
        <SunIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
      )}
    </button>
  );
}
export { ThemeToggle };
