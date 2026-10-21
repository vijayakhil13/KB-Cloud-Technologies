'use client';

import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { useFleet } from '@/lib/mock/store';
import type { PowerAction, Server } from '@/lib/mock/types';
import ConfirmPowerDialog from './ConfirmPowerDialog';

const PAST: Record<PowerAction, string> = { start: 'started', stop: 'stopped', restart: 'restarting' };

/**
 * Shared power flow: request(server, action) opens the confirm dialog; confirming
 * runs the action with busy state and ok/crit toasts. Render `dialog` once.
 */
export function usePower() {
  const { powerServer } = useFleet();
  const toast = useToast();
  const [pending, setPending] = useState<{ id: string; name: string; action: PowerAction } | null>(null);
  const [busy, setBusy] = useState<Record<string, PowerAction>>({});

  const run = useCallback(
    async (id: string, name: string, action: PowerAction): Promise<void> => {
      setBusy((b) => ({ ...b, [id]: action }));
      try {
        await powerServer(id, action);
        toast({
          tone: 'ok',
          title: `${name} ${PAST[action]}`,
          action:
            action === 'stop'
              ? {
                  label: 'Undo',
                  onClick: () => {
                    powerServer(id, 'start').catch(() =>
                      toast({ tone: 'crit', title: `Could not start ${name}`, description: 'Please try again.' }),
                    );
                  },
                }
              : undefined,
        });
      } catch (e) {
        toast({
          tone: 'crit',
          title: `Could not ${action} ${name}`,
          description: e instanceof Error ? e.message : 'Something went wrong.',
          action: { label: 'Retry', onClick: () => void run(id, name, action) },
        });
      } finally {
        setBusy((b) => {
          const { [id]: _done, ...rest } = b;
          return rest;
        });
      }
    },
    [powerServer, toast],
  );

  const request = useCallback((server: Pick<Server, 'id' | 'name'>, action: PowerAction) => {
    setPending({ id: server.id, name: server.name, action });
  }, []);

  const dialog = (
    <ConfirmPowerDialog
      target={pending}
      onCancel={() => setPending(null)}
      onConfirm={() => {
        if (!pending) return;
        const p = pending;
        setPending(null);
        void run(p.id, p.name, p.action);
      }}
    />
  );

  return { request, busy, dialog };
}
