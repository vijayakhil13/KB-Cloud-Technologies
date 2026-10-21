'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';

const STAGES = ['Allocating resources...', 'Installing OS...', 'Ready'];
const DURATION_MS = 2500;

/** Mock provisioning progress; mirrors the 2.5s delay of the store's deployServer. */
export default function ProvisioningPanel({ name }: { name: string }) {
  const [pct, setPct] = useState(4);

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => setPct(Math.min(96, 4 + ((Date.now() - start) / DURATION_MS) * 92)), 120);
    return () => clearInterval(t);
  }, []);

  const stage = pct < 40 ? 0 : pct < 85 ? 1 : 2;
  return (
    <Card padding="lg" aria-live="polite">
      <h2 className="font-display text-2xl font-medium text-ink">Setting up {name}</h2>
      <div
        role="progressbar"
        aria-label="Provisioning progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="mt-5 h-2.5 overflow-hidden rounded-pill bg-surface-2"
      >
        <div className="h-full rounded-pill bg-primary transition-[width] duration-150" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-ink-soft">{STAGES[stage]}</p>
    </Card>
  );
}
