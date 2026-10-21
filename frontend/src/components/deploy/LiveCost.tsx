import { calcPrice, formatINR } from '@/lib/pricing';
import { OS_LABEL, REGION_LABEL } from '@/lib/mock/derive';
import type { Draft } from './draft';

const HOURS_PER_MONTH = 730;

/** Desktop side panel: price updates on every choice. */
export default function LiveCost({ draft }: { draft: Draft }) {
  const price = calcPrice(draft);
  return (
    <aside aria-label="Cost summary" className="rounded-2xl bg-primary-soft p-6 lg:sticky lg:top-24">
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">Your server</p>
      <div aria-live="polite" aria-atomic="true" className="mt-3">
        <p className="font-display text-4xl font-medium tabular-nums text-primary-ink">
          {formatINR(price)}
          <span className="text-base font-normal"> /month</span>
        </p>
        <p className="mt-1 text-sm tabular-nums text-ink-soft">about {formatINR(price / HOURS_PER_MONTH)} per hour</p>
      </div>
      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">OS</dt>
          <dd className="text-right text-ink">{OS_LABEL[draft.os]}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">Size</dt>
          <dd className="text-right tabular-nums text-ink">
            {draft.vcpu} vCPU · {draft.ramGb} GB · {draft.storageGb} GB
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-soft">Region</dt>
          <dd className="text-right text-ink">{draft.region ? REGION_LABEL[draft.region] : 'Not chosen yet'}</dd>
        </div>
      </dl>
    </aside>
  );
}
