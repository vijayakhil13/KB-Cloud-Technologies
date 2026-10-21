export type OsFamily = 'linux' | 'windows';

export interface ServerSpec {
  vcpu: number;
  ramGb: number;
  storageGb: number;
  os: 'ubuntu' | 'debian' | 'windows' | 'rocky' | OsFamily;
}

export const RATES = { vcpu: 350, ramGb: 160, storageGb: 4, windows: 800 } as const;

export const RANGES = {
  vcpu: { min: 1, max: 16, step: 1 },
  ramGb: { min: 1, max: 64, step: 1 },
  storageGb: { min: 20, max: 1000, step: 10 },
} as const;

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(n: number): string {
  return inr.format(n);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function osSurcharge(os: ServerSpec['os']): number {
  return os === 'windows' ? RATES.windows : 0;
}

export function priceBreakdown(s: ServerSpec) {
  const cpu = s.vcpu * RATES.vcpu;
  const ram = s.ramGb * RATES.ramGb;
  const disk = s.storageGb * RATES.storageGb;
  const os = osSurcharge(s.os);
  return { cpu, ram, disk, os, total: cpu + ram + disk + os };
}

export function calcPrice(s: ServerSpec): number {
  return priceBreakdown(s).total;
}

export interface Preset {
  id: 'starter' | 'standard' | 'pro';
  name: string;
  blurb: string;
  vcpu: number;
  ramGb: number;
  storageGb: number;
}

export const PRESETS: Preset[] = [
  { id: 'starter', name: 'Starter', blurb: 'Side projects and small sites', vcpu: 1, ramGb: 2, storageGb: 40 },
  { id: 'standard', name: 'Standard', blurb: 'Apps and databases with steady traffic', vcpu: 2, ramGb: 4, storageGb: 80 },
  { id: 'pro', name: 'Pro', blurb: 'Busy services that need headroom', vcpu: 4, ramGb: 16, storageGb: 200 },
];

export type ForecastTone = 'ok' | 'warn' | 'crit';

export function storageForecast(
  storageGb: number,
  usedGb: number,
  growthPerDay: number
): { text: string; tone: ForecastTone } {
  if (growthPerDay <= 0) return { text: 'Plenty of room', tone: 'ok' };
  const days = Math.max(0, Math.floor((storageGb - usedGb) / growthPerDay));
  if (days > 90) return { text: 'Plenty of room', tone: 'ok' };
  const text = days === 0 ? 'Storage is full' : `Storage full in ~${days} days`;
  return { text, tone: days < 7 ? 'crit' : days < 30 ? 'warn' : 'ok' };
}
