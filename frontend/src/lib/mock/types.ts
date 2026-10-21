export type ServerStatus = 'running' | 'stopped' | 'restarting';
export type ServerOs = 'ubuntu' | 'debian' | 'windows' | 'rocky';
export type ServerRegion = 'mumbai' | 'chennai' | 'delhi';
export type PowerAction = 'start' | 'stop' | 'restart';

export interface Server {
  id: string;
  name: string;
  os: ServerOs;
  region: ServerRegion;
  vcpu: number;
  ramGb: number;
  storageGb: number;
  ip: string;
  status: ServerStatus;
  priceInrMonth: number;
  /** 7 daily values, percent */
  usage: { cpu: number[]; ram: number[]; storage: number[] };
  storageUsedGb: number;
  storageGrowthGbPerDay: number;
  createdAt: string;
}

export type AlertState = 'open' | 'acknowledged' | 'snoozed' | 'resolved';
export type AlertSeverity = 'ok' | 'warn' | 'crit';
export type SnoozeDuration = '1h' | '24h';

export interface Alert {
  id: string;
  serverId: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
  createdAt: string;
  state: AlertState;
  snoozedUntil?: string;
}

export type ActivityKind = 'power' | 'alert' | 'deploy' | 'billing';

export interface Activity {
  id: string;
  at: string;
  serverId?: string;
  kind: ActivityKind;
  text: string;
}

export interface DeployInput {
  name: string;
  os: ServerOs;
  region: ServerRegion;
  vcpu: number;
  ramGb: number;
  storageGb: number;
  priceInrMonth: number;
}
