import { PRESETS, RANGES, RATES, clamp, formatINR } from '@/lib/pricing';
import type { ServerOs, ServerRegion } from '@/lib/mock/types';

export const DRAFT_KEY = 'ch-deploy-draft';

export type SizeChoice = 'starter' | 'standard' | 'pro' | 'custom';

export interface Draft {
  os: ServerOs;
  size: SizeChoice;
  vcpu: number;
  ramGb: number;
  storageGb: number;
  region: ServerRegion | null;
  name: string;
  agree: boolean;
}

export const NAME_RE = /^[a-z0-9-]{3,32}$/;

export const OS_OPTIONS: { value: ServerOs; title: string; description: string }[] = [
  { value: 'ubuntu', title: 'Ubuntu 22.04', description: 'The friendly Linux default. Great for web apps.' },
  { value: 'debian', title: 'Debian 12', description: 'Rock-solid and minimal. Great for databases.' },
  { value: 'rocky', title: 'Rocky Linux 9', description: 'Enterprise-style Linux, long support window.' },
  { value: 'windows', title: 'Windows Server 2022', description: `Remote desktop and Windows apps. +${formatINR(RATES.windows)} licence.` },
];

export const REGION_OPTIONS: { value: ServerRegion; title: string; latency: string; x: number; y: number }[] = [
  { value: 'delhi', title: 'Delhi', latency: '~18 ms from you', x: 52, y: 22 },
  { value: 'mumbai', title: 'Mumbai', latency: '~12 ms from you', x: 30, y: 58 },
  { value: 'chennai', title: 'Chennai', latency: '~22 ms from you', x: 56, y: 80 },
];

export function emptyDraft(name: string): Draft {
  const p = PRESETS[1];
  return { os: 'ubuntu', size: 'standard', vcpu: p.vcpu, ramGb: p.ramGb, storageGb: p.storageGb, region: null, name, agree: false };
}

/** Reads the landing calculator hand-off: ?cpu=&ram=&disk=&os= */
export function applyQuery(d: Draft, search: string): Draft {
  const q = new URLSearchParams(search);
  const num = (key: string, r: { min: number; max: number }) => {
    const v = Number(q.get(key));
    return q.has(key) && Number.isFinite(v) ? clamp(Math.round(v), r.min, r.max) : null;
  };
  const vcpu = num('cpu', RANGES.vcpu);
  const ramGb = num('ram', RANGES.ramGb);
  const storageGb = num('disk', RANGES.storageGb);
  const os = q.get('os');
  const next = { ...d };
  if (vcpu !== null || ramGb !== null || storageGb !== null) {
    next.vcpu = vcpu ?? d.vcpu;
    next.ramGb = ramGb ?? d.ramGb;
    next.storageGb = storageGb ?? d.storageGb;
    const hit = PRESETS.find((p) => p.vcpu === next.vcpu && p.ramGb === next.ramGb && p.storageGb === next.storageGb);
    next.size = hit ? hit.id : 'custom';
  }
  if (os === 'windows') next.os = 'windows';
  else if (os === 'linux') next.os = d.os === 'windows' ? 'ubuntu' : d.os;
  else if (os === 'ubuntu' || os === 'debian' || os === 'rocky') next.os = os;
  return next;
}
