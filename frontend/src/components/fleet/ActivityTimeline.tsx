'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { dayLabel, formatTime } from '@/lib/mock/derive';
import type { Activity, ActivityKind } from '@/lib/mock/types';

const DOT: Record<ActivityKind, string> = {
  power: 'bg-primary',
  alert: 'bg-warn',
  deploy: 'bg-accent',
  billing: 'bg-ink-muted',
};
const KIND_LABEL: Record<ActivityKind, string> = {
  power: 'Power',
  alert: 'Alert',
  deploy: 'Deploy',
  billing: 'Billing',
};
const PAGE = 8;

export default function ActivityTimeline({ activity }: { activity: Activity[] }) {
  const [shown, setShown] = useState(PAGE);
  const sorted = [...activity].sort((a, b) => b.at.localeCompare(a.at)).slice(0, shown);
  const groups: { day: string; items: Activity[] }[] = [];
  for (const a of sorted) {
    const day = dayLabel(a.at);
    const g = groups[groups.length - 1];
    if (g && g.day === day) g.items.push(a);
    else groups.push({ day, items: [a] });
  }

  return (
    <Card as="section" aria-labelledby="activity-heading">
      <h2 id="activity-heading" className="font-display text-xl font-medium text-ink">
        Recent activity
      </h2>
      {groups.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Nothing yet. Actions on your servers show up here.</p>
      ) : (
        <div className="mt-5 space-y-5">
          {groups.map((g) => (
            <div key={g.day}>
              <h3 className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">{g.day}</h3>
              <ol className="relative ml-3 mt-3 border-l border-border">
                {g.items.map((a) => (
                  <li key={a.id} className="relative pb-5 pl-6 last:pb-0">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full ring-4 ring-surface ${DOT[a.kind]}`}
                    />
                    <p className="text-sm text-ink">
                      <span className="sr-only">{KIND_LABEL[a.kind]}: </span>
                      {a.text}
                    </p>
                    <time dateTime={a.at} className="text-xs text-ink-muted">
                      {formatTime(a.at)}
                    </time>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
      {activity.length > shown && (
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setShown((n) => n + PAGE)}>
          Show more
        </Button>
      )}
    </Card>
  );
}
