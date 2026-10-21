'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { calcPrice } from '@/lib/pricing';
import type {
  Activity,
  ActivityKind,
  Alert,
  AlertState,
  DeployInput,
  PowerAction,
  Server,
  SnoozeDuration,
} from './types';

/**
 * Frontend-only fleet store, persisted to localStorage. Every mutation returns a
 * Promise with a realistic delay; swapping this file for fetch() calls later is the
 * only change needed.
 */

const STORAGE_KEY = 'ch-fleet-v1';
const DELAY_MS = 600;
const RESTART_MS = 2500;
const FAILURE_RATE = 0.1;

export type FleetStatus = 'loading' | 'ready' | 'error';

interface FleetData {
  servers: Server[];
  alerts: Alert[];
  activity: Activity[];
}
interface FleetState extends FleetData {
  status: FleetStatus;
}

const EMPTY: FleetState = { status: 'loading', servers: [], alerts: [], activity: [] };

let state: FleetState = EMPTY;
let loadStarted = false;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const ago = (mins: number) => new Date(Date.now() - mins * 60000).toISOString();
const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

function set(next: Partial<FleetState>) {
  state = { ...state, ...next };
  if (state.status === 'ready') {
    try {
      const { servers, alerts, activity } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ servers, alerts, activity }));
    } catch {
      /* storage full or blocked: keep in-memory state */
    }
  }
  listeners.forEach((l) => l());
}

type SeedServer = Omit<Server, 'priceInrMonth' | 'status' | 'createdAt'> & {
  status?: Server['status'];
  ageDays: number;
};

function seed(): FleetData {
  const make = ({ ageDays, status = 'running', ...s }: SeedServer): Server => ({
    ...s,
    status,
    priceInrMonth: calcPrice(s),
    createdAt: ago(ageDays * 1440),
  });
  const servers: Server[] = [
    make({ id: 'srv_api', name: 'api-server', os: 'ubuntu', region: 'mumbai', vcpu: 2, ramGb: 4, storageGb: 80,
      ip: '103.21.58.14', usage: { cpu: [32, 38, 35, 44, 41, 36, 34], ram: [55, 58, 57, 61, 63, 62, 64], storage: [58, 59, 60, 60, 61, 62, 62] },
      storageUsedGb: 50, storageGrowthGbPerDay: 0.8, ageDays: 94 }),
    make({ id: 'srv_db', name: 'orders-db', os: 'debian', region: 'chennai', vcpu: 4, ramGb: 16, storageGb: 200,
      ip: '103.21.60.201', usage: { cpu: [48, 52, 61, 58, 66, 71, 69], ram: [72, 74, 77, 79, 82, 84, 86], storage: [78, 80, 82, 84, 86, 88, 90] },
      storageUsedGb: 180, storageGrowthGbPerDay: 1.1, ageDays: 210 }),
    make({ id: 'srv_tally', name: 'tally-desktop', os: 'windows', region: 'mumbai', vcpu: 4, ramGb: 8, storageGb: 250,
      ip: '103.21.58.77', usage: { cpu: [22, 28, 31, 26, 30, 24, 28], ram: [60, 62, 61, 63, 62, 64, 62], storage: [42, 43, 43, 44, 44, 45, 45] },
      storageUsedGb: 112, storageGrowthGbPerDay: 0.4, ageDays: 150 }),
    make({ id: 'srv_stage', name: 'staging-web', os: 'rocky', region: 'delhi', vcpu: 1, ramGb: 2, storageGb: 40,
      ip: '103.21.71.9', status: 'stopped', usage: { cpu: [5, 8, 4, 6, 3, 2, 1], ram: [20, 22, 21, 20, 19, 18, 18], storage: [30, 30, 31, 31, 31, 32, 32] },
      storageUsedGb: 13, storageGrowthGbPerDay: 0, ageDays: 30 }),
  ];
  const alerts: Alert[] = [
    { id: 'al_1', serverId: 'srv_db', severity: 'crit', title: 'Storage almost full',
      detail: 'orders-db is at 90% of its disk. At the current growth it will fill in about 18 days.', createdAt: ago(35), state: 'open' },
    { id: 'al_2', serverId: 'srv_db', severity: 'warn', title: 'High memory use',
      detail: 'Memory has stayed above 80% for the last 3 days.', createdAt: ago(190), state: 'open' },
    { id: 'al_3', serverId: 'srv_api', severity: 'warn', title: 'CPU spike',
      detail: 'CPU reached 44% during the nightly job. Usually safe; keep an eye on it.', createdAt: ago(1500), state: 'acknowledged' },
    { id: 'al_4', serverId: 'srv_tally', severity: 'ok', title: 'Backup completed',
      detail: 'Daily snapshot finished in 6 minutes and is stored in Mumbai.', createdAt: ago(420), state: 'open' },
    { id: 'al_5', serverId: 'srv_stage', severity: 'warn', title: 'Server is stopped',
      detail: 'staging-web has been stopped for 2 days. Stopped servers still bill for storage.', createdAt: ago(2900), state: 'resolved' },
  ];
  const activity: Activity[] = [
    { id: 'ac_1', at: ago(35), serverId: 'srv_db', kind: 'alert', text: 'Alert raised: orders-db storage almost full' },
    { id: 'ac_2', at: ago(190), serverId: 'srv_db', kind: 'alert', text: 'Alert raised: orders-db high memory use' },
    { id: 'ac_3', at: ago(420), serverId: 'srv_tally', kind: 'alert', text: 'Backup completed on tally-desktop' },
    { id: 'ac_4', at: ago(1500), serverId: 'srv_api', kind: 'alert', text: 'CPU spike acknowledged on api-server' },
    { id: 'ac_5', at: ago(1700), serverId: 'srv_api', kind: 'power', text: 'api-server restarted' },
    { id: 'ac_6', at: ago(2900), serverId: 'srv_stage', kind: 'power', text: 'staging-web stopped' },
    { id: 'ac_7', at: ago(4300), kind: 'billing', text: 'Invoice for last month paid' },
    { id: 'ac_8', at: ago(43200), serverId: 'srv_stage', kind: 'deploy', text: 'staging-web deployed in Delhi' },
    { id: 'ac_9', at: ago(65000), serverId: 'srv_tally', kind: 'deploy', text: 'tally-desktop deployed in Mumbai' },
  ];
  return { servers, alerts, activity };
}

function load() {
  set({ status: 'loading' });
  setTimeout(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? (JSON.parse(raw) as FleetData) : seed();
      const servers = data.servers.map((s) => (s.status === 'restarting' ? { ...s, status: 'running' as const } : s));
      set({ ...data, servers, status: 'ready' });
      expireSnoozes();
    } catch {
      set({ status: 'error' });
    }
  }, 500);
}

function expireSnoozes() {
  const due = (a: Alert) => a.state === 'snoozed' && !!a.snoozedUntil && new Date(a.snoozedUntil).getTime() <= Date.now();
  if (!state.alerts.some(due)) return;
  set({ alerts: state.alerts.map((a) => (due(a) ? { ...a, state: 'open', snoozedUntil: undefined } : a)) });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!loadStarted) {
    loadStarted = true;
    load();
  }
  if (!timer) timer = setInterval(expireSnoozes, 30000);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => EMPTY;

function addActivity(kind: ActivityKind, text: string, serverId?: string) {
  const entry: Activity = { id: uid('ac'), at: new Date().toISOString(), kind, text, serverId };
  set({ activity: [entry, ...state.activity] });
}

async function maybeFail(what: string) {
  await wait(DELAY_MS);
  if (Math.random() < FAILURE_RATE) throw new Error(`Could not ${what}. Please try again.`);
}

const patchServer = (id: string, patch: Partial<Server>) =>
  set({ servers: state.servers.map((s) => (s.id === id ? { ...s, ...patch } : s)) });

const patchAlert = (id: string, patch: Partial<Alert>) =>
  set({ alerts: state.alerts.map((a) => (a.id === id ? { ...a, ...patch } : a)) });

async function powerServer(id: string, action: PowerAction): Promise<void> {
  const server = state.servers.find((s) => s.id === id);
  if (!server) throw new Error('Server not found.');
  await maybeFail(`${action} ${server.name}`);
  if (action === 'restart') {
    patchServer(id, { status: 'restarting' });
    addActivity('power', `${server.name} restarting`, id);
    setTimeout(() => patchServer(id, { status: 'running' }), RESTART_MS);
    return;
  }
  patchServer(id, { status: action === 'start' ? 'running' : 'stopped' });
  addActivity('power', `${server.name} ${action === 'start' ? 'started' : 'stopped'}`, id);
}

async function setAlertState(id: string, next: AlertState, snoozedUntil: string | undefined, verb: string) {
  const alert = state.alerts.find((a) => a.id === id);
  if (!alert) throw new Error('Alert not found.');
  const prev = { state: alert.state, snoozedUntil: alert.snoozedUntil };
  patchAlert(id, { state: next, snoozedUntil }); // optimistic
  try {
    await maybeFail(`${verb} this alert`);
  } catch (e) {
    patchAlert(id, prev); // rollback
    throw e;
  }
  const serverName = state.servers.find((s) => s.id === alert.serverId)?.name ?? 'server';
  addActivity('alert', `${alert.title} ${next} on ${serverName}`, alert.serverId);
}

const fleetActions = {
  powerServer,
  startServer: (id: string) => powerServer(id, 'start'),
  stopServer: (id: string) => powerServer(id, 'stop'),
  restartServer: (id: string) => powerServer(id, 'restart'),

  async deployServer(input: DeployInput): Promise<Server> {
    await wait(2500);
    if (Math.random() < FAILURE_RATE / 2) throw new Error('Provisioning failed. Your draft is saved, please try again.');
    const server: Server = {
      id: uid('srv'),
      ...input,
      ip: `103.21.${Math.floor(Math.random() * 200 + 20)}.${Math.floor(Math.random() * 200 + 10)}`,
      status: 'running',
      usage: { cpu: [2, 2, 3, 2, 2, 3, 2], ram: [12, 12, 13, 13, 14, 14, 14], storage: [3, 3, 3, 4, 4, 4, 4] },
      storageUsedGb: Math.max(1, Math.round(input.storageGb * 0.04)),
      storageGrowthGbPerDay: 0.2,
      createdAt: new Date().toISOString(),
    };
    set({ servers: [server, ...state.servers] });
    addActivity('deploy', `${server.name} deployed`, server.id);
    return server;
  },

  ackAlert: (id: string) => setAlertState(id, 'acknowledged', undefined, 'acknowledge'),
  snoozeAlert: (id: string, d: SnoozeDuration) =>
    setAlertState(id, 'snoozed', new Date(Date.now() + (d === '1h' ? 3600000 : 86400000)).toISOString(), 'snooze'),
  resolveAlert: (id: string) => setAlertState(id, 'resolved', undefined, 'resolve'),
  /** Undo for resolve: restores the open state without a new activity entry. */
  async reopenAlert(id: string): Promise<void> {
    patchAlert(id, { state: 'open', snoozedUntil: undefined });
  },
  async resolveAllAcknowledged(): Promise<number> {
    await wait(DELAY_MS);
    const ids = state.alerts.filter((a) => a.state === 'acknowledged').map((a) => a.id);
    set({ alerts: state.alerts.map((a) => (ids.includes(a.id) ? { ...a, state: 'resolved' as const } : a)) });
    if (ids.length) addActivity('alert', `${ids.length} acknowledged alert${ids.length === 1 ? '' : 's'} resolved`);
    return ids.length;
  },
};

export function useFleet() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reload = useCallback(() => load(), []);
  return { ...s, ...fleetActions, reload };
}
