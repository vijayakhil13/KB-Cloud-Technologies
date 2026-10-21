'use client';

import { useRef } from 'react';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import type { PowerAction } from '@/lib/mock/types';

const COPY: Record<PowerAction, { title: (n: string) => string; body: string; confirm: string }> = {
  stop: {
    title: (n) => `Stop ${n}?`,
    body: 'Running apps go offline until you start it again.',
    confirm: 'Stop server',
  },
  start: {
    title: (n) => `Start ${n}?`,
    body: 'The server boots in about a minute and usage billing resumes.',
    confirm: 'Start server',
  },
  restart: {
    title: (n) => `Restart ${n}?`,
    body: 'Apps are unreachable for about a minute while the server restarts.',
    confirm: 'Restart server',
  },
};

export interface ConfirmPowerDialogProps {
  target: { name: string; action: PowerAction } | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmPowerDialog({ target, onCancel, onConfirm }: ConfirmPowerDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  // keep last copy while the closing transition plays
  const last = useRef(target);
  if (target) last.current = target;
  const t = last.current;
  return (
    <Dialog
      open={target !== null}
      onClose={onCancel}
      title={t ? COPY[t.action].title(t.name) : ''}
      description={t ? COPY[t.action].body : undefined}
      initialFocus={cancelRef}
      footer={
        <>
          <Button ref={cancelRef as React.Ref<HTMLButtonElement>} variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={t?.action === 'stop' ? 'danger' : 'primary'} onClick={onConfirm}>
            {t ? COPY[t.action].confirm : 'Confirm'}
          </Button>
        </>
      }
    />
  );
}
