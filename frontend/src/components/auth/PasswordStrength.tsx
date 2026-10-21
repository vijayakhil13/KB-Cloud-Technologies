import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/cn';

export interface Strength {
  score: number; // 0-4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  checks: { id: string; label: string; ok: boolean }[];
}

export function evaluatePassword(pw: string): Strength {
  const checks = [
    { id: 'len', label: '8 or more characters', ok: pw.length >= 8 },
    { id: 'case', label: 'Upper and lower case letters', ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { id: 'num', label: 'A number', ok: /\d/.test(pw) },
    { id: 'sym', label: 'A symbol', ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const raw =
    (pw.length >= 8 ? 1 : 0) +
    (pw.length >= 12 ? 1 : 0) +
    (checks[1].ok ? 1 : 0) +
    (checks[2].ok ? 1 : 0) +
    (checks[3].ok ? 1 : 0);
  const score = Math.min(4, raw);
  const label = (['Weak', 'Weak', 'Fair', 'Good', 'Strong'] as const)[score];
  return { score, label, checks };
}

const fills = ['bg-surface-2', 'bg-crit', 'bg-warn', 'bg-warn', 'bg-ok'];

export default function PasswordStrength({ password, id }: { password: string; id: string }) {
  const s = evaluatePassword(password);
  return (
    <div id={id} className="mt-3">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn('h-1.5 flex-1 rounded-pill bg-surface-2', s.score >= i && fills[s.score])} />
        ))}
      </div>
      <p className="mt-2 text-xs font-medium text-ink-soft" aria-live="polite">
        {password ? `Password strength: ${s.label}` : 'Password strength: enter a password'}
      </p>
      <ul className="mt-2 grid gap-1 text-xs text-ink-soft sm:grid-cols-2">
        {s.checks.map((c) => (
          <li key={c.id} className="flex items-center gap-1.5">
            {c.ok ? (
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-ok" width={16} height={16} aria-hidden="true" />
            ) : (
              <MinusCircleIcon className="h-4 w-4 shrink-0 text-ink-muted" width={16} height={16} aria-hidden="true" />
            )}
            <span>
              {c.label}
              <span className="sr-only">{c.ok ? ' (done)' : ' (not yet)'}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
