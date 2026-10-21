import type { Alert, Server } from './types';

export type Tone = 'ok' | 'warn' | 'crit';

export const REGION_LABEL = { mumbai: 'Mumbai', chennai: 'Chennai', delhi: 'Delhi' } as const;
export const OS_LABEL = {
  ubuntu: 'Ubuntu 22.04',
  debian: 'Debian 12',
  windows: 'Windows Server 2022',
  rocky: 'Rocky Linux 9',
} as const;

export const last = (xs: number[]): number => xs[xs.length - 1] ?? 0;
export const avg = (xs: number[]): number =>
  xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0;
export const peak = (xs: number[]): number => (xs.length ? Math.max(...xs) : 0);

/** 100 minus penalties for hot resources and unresolved alerts. */
export function healthScore(server: Server, alerts: Alert[]): number {
  let score = 100;
  if (last(server.usage.cpu) > 85) score -= 15;
  if (last(server.usage.ram) > 85) score -= 15;
  if (last(server.usage.storage) > 85) score -= 15;
  for (const a of alerts) {
    if (a.serverId !== server.id || a.state !== 'open') continue;
    score -= a.severity === 'crit' ? 15 : a.severity === 'warn' ? 6 : 0;
  }
  return Math.max(0, Math.min(100, score));
}

export function healthTone(score: number): Tone {
  return score >= 80 ? 'ok' : score >= 50 ? 'warn' : 'crit';
}

export function relativeTime(iso: string, now = Date.now()): string {
  const mins = Math.round((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export function dayLabel(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(now) - startOf(d)) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function generatedName(): string {
  const adj = ['calm', 'brisk', 'mellow', 'bright', 'quiet', 'steady'];
  const noun = ['otter', 'heron', 'maple', 'comet', 'river', 'falcon'];
  const pick = (xs: string[]) => xs[Math.floor(Math.random() * xs.length)];
  return `${pick(adj)}-${pick(noun)}-${Math.floor(10 + Math.random() * 90)}`;
}
