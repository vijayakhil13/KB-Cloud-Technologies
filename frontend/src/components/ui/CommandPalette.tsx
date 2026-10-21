'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Combobox, Dialog as HDialog, Transition } from '@headlessui/react';
import {
  ArrowPathIcon,
  BanknotesIcon,
  BellAlertIcon,
  CheckCircleIcon,
  HomeIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlayIcon,
  PlusCircleIcon,
  ServerStackIcon,
  Squares2X2Icon,
  StopIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { getAccessToken } from '@/lib/api/authService';
import { useFleet } from '@/lib/mock/store';
import type { PowerAction } from '@/lib/mock/types';
import { usePower } from '@/components/fleet/usePower';
import { useToast } from './Toast';
import { useTheme } from './ThemeProvider';
import Button from './Button';
import Dialog from './Dialog';
import { cn } from '@/lib/cn';

type Group = 'Go to' | 'Actions' | 'Servers';

interface Command {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  run: () => void;
}

const RECENT_KEY = 'ch-palette-recent';

/* ---------- context ---------- */

interface PaletteCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const Ctx = createContext<PaletteCtx | null>(null);

export function usePalette(): PaletteCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('usePalette must be used inside <PaletteProvider>');
  return c;
}

/** Simple lowercase subsequence scorer: higher is better, -1 means no match. */
function score(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;
  const at = t.indexOf(q);
  if (at >= 0) return 100 - at;
  let qi = 0;
  let s = 0;
  let prev = -2;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      s += prev === i - 1 ? 3 : 1;
      prev = i;
      qi++;
    }
  }
  return qi === q.length ? s : -1;
}

function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/* ---------- provider ---------- */

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const el = e.target as HTMLElement | null;
        const typing = el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
        if (!typing) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) setAuthed(!!getAccessToken());
  }, [open]);

  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {authed ? <AuthedPalette /> : <GuestPalette />}
    </Ctx.Provider>
  );
}

/* ---------- command builders ---------- */

function useBaseCommands(authed: boolean): Command[] {
  const router = useRouter();
  const { toggle, resolved } = useTheme();
  const go = (href: string) => () => router.push(href);
  return [
    { id: 'go-home', group: 'Go to', label: 'Home', icon: HomeIcon, run: go('/') },
    ...(authed
      ? [
          { id: 'go-fleet', group: 'Go to', label: 'Fleet', icon: Squares2X2Icon, run: go('/dashboard') },
          { id: 'go-deploy', group: 'Go to', label: 'Deploy a server', icon: PlusCircleIcon, run: go('/dashboard/deploy') },
          { id: 'go-alerts', group: 'Go to', label: 'Alerts', icon: BellAlertIcon, run: go('/dashboard/alerts') },
          { id: 'go-billing', group: 'Go to', label: 'Billing', icon: BanknotesIcon, run: go('/dashboard/billing') },
          { id: 'go-support', group: 'Go to', label: 'Support', icon: LifebuoyIcon, run: go('/dashboard/support') },
        ]
      : [{ id: 'go-signin', group: 'Go to', label: 'Sign in', icon: ArrowRightOnRectangleIcon, run: go('/auth/login') }]),
    {
      id: 'act-theme',
      group: 'Actions',
      label: `Switch to ${resolved === 'dark' ? 'light' : 'dark'} theme`,
      icon: MoonIcon,
      run: toggle,
    },
  ] as Command[];
}

function GuestPalette() {
  const commands = useBaseCommands(false);
  return <PaletteDialog commands={commands} />;
}

const ACTION_ICON = { start: PlayIcon, stop: StopIcon, restart: ArrowPathIcon } as const;
const ACTION_LABEL = { start: 'Start', stop: 'Stop', restart: 'Restart' } as const;

function AuthedPalette() {
  const router = useRouter();
  const toast = useToast();
  const base = useBaseCommands(true);
  const { servers, alerts, resolveAllAcknowledged } = useFleet();
  const { request, dialog } = usePower();
  const [confirmResolve, setConfirmResolve] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const ackCount = alerts.filter((a) => a.state === 'acknowledged').length;

  const commands: Command[] = [
    ...base,
    { id: 'act-resolve', group: 'Actions', label: `Resolve all acknowledged alerts (${ackCount})`, icon: CheckCircleIcon, run: () => setConfirmResolve(true) },
    ...servers.flatMap((s) => {
      const actions: PowerAction[] = s.status === 'stopped' ? ['start'] : s.status === 'running' ? ['stop', 'restart'] : [];
      return [
        ...actions.map<Command>((a) => ({
          id: `act-${a}-${s.id}`,
          group: 'Actions',
          label: `${ACTION_LABEL[a]} ${s.name}`,
          icon: ACTION_ICON[a],
          run: () => request(s, a),
        })),
        {
          id: `srv-${s.id}`,
          group: 'Servers' as const,
          label: s.name,
          hint: s.status,
          icon: ServerStackIcon,
          run: () => router.push(`/dashboard#server-${s.id}`),
        },
      ];
    }),
  ];

  return (
    <>
      <PaletteDialog commands={commands} />
      {dialog}
      <Dialog
        open={confirmResolve}
        onClose={() => setConfirmResolve(false)}
        title="Resolve all acknowledged alerts?"
        description={`${ackCount} alert${ackCount === 1 ? '' : 's'} will move to Resolved.`}
        initialFocus={cancelRef}
        footer={
          <>
            <Button ref={cancelRef as React.Ref<HTMLButtonElement>} variant="secondary" onClick={() => setConfirmResolve(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setConfirmResolve(false);
                const n = await resolveAllAcknowledged();
                toast({ tone: 'ok', title: n ? `${n} alert${n === 1 ? '' : 's'} resolved` : 'No acknowledged alerts to resolve' });
              }}
            >
              Resolve all
            </Button>
          </>
        }
      />
    </>
  );
}

/* ---------- dialog ---------- */

function PaletteDialog({ commands }: { commands: Command[] }) {
  const { open, setOpen } = usePalette();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const trigger = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      trigger.current = document.activeElement;
      setQuery('');
      setRecent(readRecent());
    } else if (trigger.current instanceof HTMLElement) {
      trigger.current.focus();
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) {
      const recents = recent.map((id) => commands.find((c) => c.id === id)).filter((c): c is Command => !!c);
      const suggestedIds = ['go-fleet', 'go-deploy', 'go-alerts', 'act-theme', 'go-home', 'go-signin'];
      const suggested = suggestedIds
        .map((id) => commands.find((c) => c.id === id))
        .filter((c): c is Command => !!c && !recents.includes(c));
      return [
        ...recents.map((c) => ({ cmd: c, section: 'Recent' })),
        ...suggested.map((c) => ({ cmd: c, section: 'Suggested' })),
      ];
    }
    return commands
      .map((c) => ({ cmd: c, s: score(query.trim(), c.label) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => ({ cmd: x.cmd, section: x.cmd.group }));
  }, [query, commands, recent]);

  const choose = useCallback(
    (c: Command | null) => {
      if (!c) return;
      try {
        const next = [c.id, ...readRecent().filter((id) => id !== c.id)].slice(0, 3);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      setOpen(false);
      // let the dialog release focus before running the command
      setTimeout(c.run, 0);
    },
    [setOpen],
  );

  const sections = results.reduce<{ name: string; items: Command[] }[]>((acc, r) => {
    const last = acc[acc.length - 1];
    if (last && last.name === r.section) last.items.push(r.cmd);
    else acc.push({ name: r.section, items: [r.cmd] });
    return acc;
  }, []);

  return (
    <Transition show={open} as="div" afterLeave={() => setQuery('')}>
      <HDialog onClose={() => setOpen(false)} className="relative z-[70]">
        <Transition.Child
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>
        <HDialog.Panel className="fixed left-1/2 top-[8vh] w-[min(92vw,40rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-float animate-pop-in sm:top-[12vh]">
          <HDialog.Title className="sr-only">Command palette</HDialog.Title>
          <Combobox<Command | null> value={null} onChange={choose}>
            <div className="flex items-center gap-3 border-b border-border px-5">
              <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-ink-muted" width={20} height={20} aria-hidden="true" />
              <Combobox.Input
                autoFocus
                aria-label="Search commands"
                placeholder="Search servers, pages and actions"
                autoComplete="off"
                className="h-14 w-full bg-transparent text-base text-ink placeholder:text-ink-muted focus:outline-none"
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="hidden rounded-md bg-surface-2 px-1.5 py-0.5 text-xs text-ink-soft sm:block">Esc</kbd>
            </div>
            <p className="sr-only" aria-live="polite">
              {query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : ''}
            </p>
            {results.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-soft">
                Nothing for &lsquo;{query}&rsquo;. Try &lsquo;deploy&rsquo; or &lsquo;alerts&rsquo;.
              </p>
            ) : (
              <Combobox.Options static className="max-h-80 overflow-auto p-2">
                {sections.map((sec) => (
                  <li key={sec.name} role="presentation">
                    <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">{sec.name}</p>
                    <ul role="presentation">
                      {sec.items.map((c) => (
                        <Combobox.Option
                          key={c.id}
                          value={c}
                          className={({ active }) =>
                            cn(
                              'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-ink',
                              active && 'bg-primary-soft',
                            )
                          }
                        >
                          <c.icon className="h-5 w-5 shrink-0 text-ink-soft" width={20} height={20} aria-hidden="true" />
                          <span className="min-w-0 flex-1 truncate">{c.label}</span>
                          {c.hint && <span className="text-xs capitalize text-ink-muted">{c.hint}</span>}
                        </Combobox.Option>
                      ))}
                    </ul>
                  </li>
                ))}
              </Combobox.Options>
            )}
          </Combobox>
        </HDialog.Panel>
      </HDialog>
    </Transition>
  );
}
