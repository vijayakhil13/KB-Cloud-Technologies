'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Stepper from '@/components/ui/Stepper';
import { useToast } from '@/components/ui/Toast';
import { calcPrice, formatINR } from '@/lib/pricing';
import { generatedName } from '@/lib/mock/derive';
import { useFleet } from '@/lib/mock/store';
import LiveCost from './LiveCost';
import ProvisioningPanel from './ProvisioningPanel';
import { OsStep, RegionStep, ReviewStep, SizeStep, nameProblem } from './Steps';
import { DRAFT_KEY, applyQuery, emptyDraft } from './draft';
import type { Draft } from './draft';

const STEPS = [
  { id: 'os', label: 'System' },
  { id: 'size', label: 'Size' },
  { id: 'region', label: 'Region' },
  { id: 'review', label: 'Review' },
];
const HEADINGS = ['Choose an operating system', 'Pick a size', 'Choose a region', 'Review and deploy'];

type Phase = 'editing' | 'provisioning' | 'error';

export default function DeployWizard() {
  const router = useRouter();
  const toast = useToast();
  const { deployServer } = useFleet();
  const [draft, setDraft] = useState<Draft>(() => emptyDraft('calm-otter-42'));
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('editing');
  const [error, setError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [ready, setReady] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Restore the session draft, then let the landing calculator query override it.
  useEffect(() => {
    let d = emptyDraft(generatedName());
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) d = { ...d, ...(JSON.parse(saved) as Partial<Draft>) };
    } catch {
      /* ignore a corrupt draft */
    }
    setDraft(applyQuery(d, window.location.search));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable */
    }
  }, [draft, ready]);

  // Move focus to the step heading whenever the step changes.
  useEffect(() => {
    if (moved.current) heading.current?.focus();
    moved.current = true;
  }, [step]);

  const update = useCallback((patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch })), []);

  const nameError = nameProblem(draft.name);
  const valid = [true, true, draft.region !== null, !nameError && draft.agree][step];
  const last = step === STEPS.length - 1;

  const submit = async () => {
    if (!draft.region || nameError || !draft.agree) {
      setShowErrors(true);
      return;
    }
    setPhase('provisioning');
    try {
      const server = await deployServer({
        name: draft.name,
        os: draft.os,
        region: draft.region,
        vcpu: draft.vcpu,
        ramGb: draft.ramGb,
        storageGb: draft.storageGb,
        priceInrMonth: calcPrice(draft),
      });
      sessionStorage.removeItem(DRAFT_KEY);
      toast({ tone: 'ok', title: `${server.name} is ready`, description: 'Your new server is running.' });
      router.push(`/dashboard?new=${server.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setPhase('error');
    }
  };

  const next = () => (last ? void submit() : setStep((s) => s + 1));

  if (phase === 'provisioning') return <ProvisioningPanel name={draft.name} />;

  return (
    <div className="grid gap-8 pb-24 lg:grid-cols-[1fr_340px] lg:pb-0">
      <div className="space-y-6">
        <Stepper steps={STEPS} current={step} onStepClick={setStep} />

        {phase === 'error' && (
          <Card role="alert" className="flex flex-wrap items-center justify-between gap-4 !border-crit/30 !bg-crit-soft">
            <p className="flex items-center gap-2 font-medium text-crit">
              <ExclamationTriangleIcon className="h-5 w-5 shrink-0" width={20} height={20} aria-hidden="true" />
              {error}
            </p>
            <Button variant="secondary" onClick={() => void submit()}>
              Try again
            </Button>
          </Card>
        )}

        <Card padding="lg">
          <h2 ref={heading} tabIndex={-1} className="mb-6 font-display text-2xl font-medium text-ink focus:outline-none">
            {HEADINGS[step]}
          </h2>
          {step === 0 && <OsStep draft={draft} update={update} />}
          {step === 1 && <SizeStep draft={draft} update={update} />}
          {step === 2 && <RegionStep draft={draft} update={update} />}
          {step === 3 && <ReviewStep draft={draft} update={update} nameError={nameError} showErrors={showErrors} />}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            <Button className="hidden lg:inline-flex" disabled={!valid && step !== 3} onClick={next}>
              {last ? 'Deploy server' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="hidden lg:block">
        <LiveCost draft={draft} />
      </div>

      <div className="fixed inset-x-0 bottom-14 z-20 flex items-center justify-between gap-4 border-t border-border bg-surface/95 p-4 backdrop-blur md:bottom-0 lg:hidden">
        <p aria-live="polite" aria-atomic="true" className="font-display text-2xl font-medium tabular-nums text-ink">
          {formatINR(calcPrice(draft))}
          <span className="text-sm font-normal text-ink-soft"> /mo</span>
        </p>
        <Button disabled={!valid && step !== 3} onClick={next}>
          {last ? 'Deploy server' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
