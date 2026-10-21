'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckIcon, ComputerDesktopIcon, ServerIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Chip from '@/components/ui/Chip';
import Slider from '@/components/ui/Slider';
import Segmented from '@/components/ui/Segmented';
import { PRESETS, RANGES, calcPrice, clamp, formatINR, priceBreakdown, type OsFamily, type Preset } from '@/lib/pricing';

interface Config {
  vcpu: number;
  ramGb: number;
  storageGb: number;
  os: OsFamily;
}

const DEFAULT: Config = { vcpu: 2, ramGb: 4, storageGb: 80, os: 'linux' };

function matchPreset(c: Config): Preset['id'] | null {
  if (c.os !== 'linux') return null;
  return PRESETS.find((p) => p.vcpu === c.vcpu && p.ramGb === c.ramGb && p.storageGb === c.storageGb)?.id ?? null;
}

export default function PricingSuite() {
  const [cfg, setCfg] = useState<Config>(DEFAULT);
  const [announce, setAnnounce] = useState('');

  const price = calcPrice(cfg);
  const b = priceBreakdown(cfg);
  const active = matchPreset(cfg);

  useEffect(() => {
    const t = setTimeout(() => setAnnounce(`${formatINR(price)} per month`), 400);
    return () => clearTimeout(t);
  }, [price]);

  const patch = useCallback((p: Partial<Config>) => setCfg((c) => ({ ...c, ...p })), []);

  const applyPreset = (p: Preset, scroll = false) => {
    setCfg({ vcpu: p.vcpu, ramGb: p.ramGb, storageGb: p.storageGb, os: 'linux' });
    if (scroll) document.getElementById('build')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const href = `/auth/register?cpu=${cfg.vcpu}&ram=${cfg.ramGb}&disk=${cfg.storageGb}&os=${cfg.os}`;

  return (
    <>
      <section id="build" className="scroll-mt-20 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">Build your own server</p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Drag a slider. Watch the price.
            </h2>
            <p className="mt-4 text-ink-soft">
              Start from a preset or shape something of your own. What you see is what you pay each month.
            </p>
          </div>

          <Card padding="none" className="mt-10 p-6 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <div role="group" aria-label="Presets" className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <Chip key={p.id} pressed={active === p.id} onClick={() => applyPreset(p)}>
                      {p.name}
                    </Chip>
                  ))}
                </div>
                <div className="mt-8 space-y-8">
                  <Slider
                    label="vCPU"
                    value={cfg.vcpu}
                    min={RANGES.vcpu.min}
                    max={RANGES.vcpu.max}
                    unit={cfg.vcpu === 1 ? 'core' : 'cores'}
                    marks={[1, 4, 8, 12, 16]}
                    onChange={(v) => patch({ vcpu: clamp(v, RANGES.vcpu.min, RANGES.vcpu.max) })}
                  />
                  <Slider
                    label="Memory"
                    value={cfg.ramGb}
                    min={RANGES.ramGb.min}
                    max={RANGES.ramGb.max}
                    unit="GB"
                    marks={[1, 16, 32, 48, 64]}
                    onChange={(v) => patch({ ramGb: clamp(v, RANGES.ramGb.min, RANGES.ramGb.max) })}
                  />
                  <Slider
                    label="Storage"
                    value={cfg.storageGb}
                    min={RANGES.storageGb.min}
                    max={RANGES.storageGb.max}
                    step={RANGES.storageGb.step}
                    unit="GB"
                    marks={[20, 250, 500, 750, 1000]}
                    onChange={(v) => patch({ storageGb: clamp(v, RANGES.storageGb.min, RANGES.storageGb.max) })}
                  />
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Segmented<OsFamily>
                    label="Operating system"
                    value={cfg.os}
                    onChange={(os) => patch({ os })}
                    options={[
                      { value: 'linux', label: 'Linux', icon: <ServerIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" /> },
                      { value: 'windows', label: 'Windows', icon: <ComputerDesktopIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" /> },
                    ]}
                  />
                  {cfg.os === 'windows' && <span className="text-sm text-ink-muted">+{formatINR(800)} licence</span>}
                </div>
              </div>

              <div className="self-start rounded-2xl bg-primary-soft p-6 lg:sticky lg:top-24">
                <p className="text-sm font-medium text-primary-ink">Your server</p>
                <p className="mt-2 flex items-baseline gap-2" aria-hidden="true">
                  <span className="font-display text-5xl font-medium tabular-nums text-primary-ink">{formatINR(price)}</span>
                  <span className="text-ink-soft">/month</span>
                </p>
                <p className="sr-only" aria-live="polite" aria-atomic="true">
                  {announce}
                </p>
                <dl className="mt-6 space-y-2 border-t border-primary/20 pt-4 text-sm tabular-nums">
                  {[
                    [`${cfg.vcpu} vCPU`, b.cpu],
                    [`${cfg.ramGb} GB memory`, b.ram],
                    [`${cfg.storageGb} GB storage`, b.disk],
                    [cfg.os === 'windows' ? 'Windows licence' : 'Linux (free)', b.os],
                  ].map(([label, amt]) => (
                    <div key={label as string} className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{label}</dt>
                      <dd className="font-medium text-ink">{formatINR(amt as number)}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-ink-muted">Starts at 1 vCPU / 1 GB. Prices exclude GST.</p>
                <Button href={href} size="lg" className="mt-6 w-full">
                  Deploy this server
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="plans" className="scroll-mt-20 bg-surface-2/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">Plans</p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Or start from a sensible default
            </h2>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {[PRESETS[1], PRESETS[0], PRESETS[2]].map((p) => {
              const popular = p.id === 'standard';
              const total = calcPrice({ vcpu: p.vcpu, ramGb: p.ramGb, storageGb: p.storageGb, os: 'linux' });
              return (
                <li
                  key={p.id}
                  className={`flex ${popular ? 'order-first md:order-none' : ''} ${p.id === 'starter' ? 'md:order-first' : ''}`}
                >
                  <Card
                    interactive
                    padding="lg"
                    className={`flex w-full flex-col ${popular ? 'ring-2 ring-primary/40' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-medium text-ink">{p.name}</h3>
                      {popular && <Badge accent>Most chosen</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">{p.blurb}</p>
                    <p className="mt-6 flex items-baseline gap-1.5">
                      <span className="font-display text-4xl font-medium tabular-nums text-ink">{formatINR(total)}</span>
                      <span className="text-sm text-ink-muted">/month</span>
                    </p>
                    <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-soft">
                      {[`${p.vcpu} vCPU`, `${p.ramGb} GB memory`, `${p.storageGb} GB SSD storage`, 'Daily backups, 7 days'].map((f) => (
                        <li key={f} className="flex items-center gap-2.5">
                          <CheckIcon className="h-4 w-4 shrink-0 text-primary" width={16} height={16} aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={popular ? 'primary' : 'secondary'}
                      className="mt-8 w-full"
                      onClick={() => applyPreset(p, true)}
                      aria-label={`Choose ${p.name} and load it into the calculator`}
                    >
                      Choose
                    </Button>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
