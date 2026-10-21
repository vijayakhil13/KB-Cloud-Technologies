'use client';

import { CommandLineIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import Input from '@/components/ui/Input';
import Slider from '@/components/ui/Slider';
import { PRESETS, RANGES, calcPrice, formatINR } from '@/lib/pricing';
import { OS_LABEL, REGION_LABEL } from '@/lib/mock/derive';
import { cn } from '@/lib/cn';
import RadioCard from './RadioCard';
import { NAME_RE, OS_OPTIONS, REGION_OPTIONS } from './draft';
import type { Draft, SizeChoice } from './draft';

interface StepProps {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
}

export function OsStep({ draft, update }: StepProps) {
  return (
    <div role="radiogroup" aria-label="Operating system" className="grid gap-4 sm:grid-cols-2">
      {OS_OPTIONS.map((o) => (
        <RadioCard
          key={o.value}
          name="os"
          value={o.value}
          checked={draft.os === o.value}
          onChange={() => update({ os: o.value })}
          title={o.title}
          description={o.description}
          icon={
            o.value === 'windows' ? (
              <ComputerDesktopIcon className="h-6 w-6" width={24} height={24} aria-hidden="true" />
            ) : (
              <CommandLineIcon className="h-6 w-6" width={24} height={24} aria-hidden="true" />
            )
          }
        />
      ))}
    </div>
  );
}

export function SizeStep({ draft, update }: StepProps) {
  const choose = (size: SizeChoice) => {
    const p = PRESETS.find((x) => x.id === size);
    update(p ? { size, vcpu: p.vcpu, ramGb: p.ramGb, storageGb: p.storageGb } : { size });
  };
  const custom = (patch: Partial<Draft>) => update({ ...patch, size: 'custom' });

  return (
    <div className="space-y-6">
      <div role="radiogroup" aria-label="Server size" className="grid gap-4 sm:grid-cols-2">
        {PRESETS.map((p) => (
          <RadioCard
            key={p.id}
            name="size"
            value={p.id}
            checked={draft.size === p.id}
            onChange={() => choose(p.id)}
            title={`${p.name} · ${formatINR(calcPrice({ ...p, os: draft.os }))}/mo`}
            description={`${p.vcpu} vCPU · ${p.ramGb} GB RAM · ${p.storageGb} GB storage. ${p.blurb}.`}
          />
        ))}
        <RadioCard
          name="size"
          value="custom"
          checked={draft.size === 'custom'}
          onChange={() => choose('custom')}
          title="Custom"
          description="Set vCPU, RAM and storage yourself."
        />
      </div>

      {draft.size === 'custom' && (
        <div className="space-y-6 rounded-card bg-surface-2 p-5 sm:p-6">
          <Slider label="vCPU" unit="vCPU" {...RANGES.vcpu} value={draft.vcpu} onChange={(v) => custom({ vcpu: v })} marks={[1, 4, 8, 16]} />
          <Slider label="RAM" unit="GB" {...RANGES.ramGb} value={draft.ramGb} onChange={(v) => custom({ ramGb: v })} marks={[1, 16, 32, 64]} />
          <Slider
            label="Storage"
            unit="GB"
            {...RANGES.storageGb}
            value={draft.storageGb}
            onChange={(v) => custom({ storageGb: v })}
            marks={[20, 250, 500, 1000]}
          />
        </div>
      )}
    </div>
  );
}

export function RegionStep({ draft, update }: StepProps) {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_200px]">
      <div role="radiogroup" aria-label="Region" className="space-y-4">
        {REGION_OPTIONS.map((r) => (
          <RadioCard
            key={r.value}
            name="region"
            value={r.value}
            checked={draft.region === r.value}
            onChange={() => update({ region: r.value })}
            title={r.title}
            description={r.latency}
          />
        ))}
      </div>
      <svg viewBox="0 0 100 100" role="img" aria-label="Map of India with Delhi, Mumbai and Chennai marked" className="mx-auto hidden h-52 w-full max-w-[200px] md:block">
        <path
          d="M40 6 L62 12 L70 28 L84 36 L74 52 L64 62 L60 88 L52 96 L44 84 L34 66 L16 56 L22 42 L34 36 L32 20 Z"
          className="fill-primary-soft stroke-primary"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {REGION_OPTIONS.map((r) => {
          const on = draft.region === r.value;
          return (
            <g key={r.value}>
              <circle cx={r.x} cy={r.y} r={on ? 5 : 3.5} className={on ? 'fill-primary' : 'fill-ink-muted'} />
              {on && <circle cx={r.x} cy={r.y} r="9" fill="none" className="stroke-primary" strokeWidth="1.5" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ReviewStep({
  draft,
  update,
  nameError,
  showErrors,
}: StepProps & { nameError?: string; showErrors: boolean }) {
  const price = calcPrice(draft);
  const rows: [string, string][] = [
    ['Operating system', OS_LABEL[draft.os]],
    ['Size', `${draft.vcpu} vCPU · ${draft.ramGb} GB RAM · ${draft.storageGb} GB storage`],
    ['Region', draft.region ? REGION_LABEL[draft.region] : 'Not chosen'],
    ['Monthly price', formatINR(price)],
  ];
  return (
    <div className="space-y-6">
      <dl className="divide-y divide-border rounded-card border border-border">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-5 py-3">
            <dt className="text-ink-soft">{k}</dt>
            <dd className="font-medium tabular-nums text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <Input
        label="Server name"
        value={draft.name}
        onChange={(e) => update({ name: e.target.value.toLowerCase() })}
        hint="3 to 32 characters: lowercase letters, numbers and dashes."
        error={showErrors ? nameError : undefined}
        autoComplete="off"
        spellCheck={false}
      />
      <label className="flex cursor-pointer items-start gap-3 text-ink">
        <input
          type="checkbox"
          checked={draft.agree}
          onChange={(e) => update({ agree: e.target.checked })}
          aria-describedby={showErrors && !draft.agree ? 'agree-err' : undefined}
          className="mt-1 h-5 w-5 shrink-0 rounded border-border accent-primary"
        />
        I understand billing starts now.
      </label>
      {showErrors && !draft.agree && (
        <p id="agree-err" className={cn('-mt-3 text-sm text-crit')}>
          Please confirm to continue.
        </p>
      )}
    </div>
  );
}

export function nameProblem(name: string): string | undefined {
  return NAME_RE.test(name) ? undefined : 'Use 3 to 32 lowercase letters, numbers or dashes.';
}
