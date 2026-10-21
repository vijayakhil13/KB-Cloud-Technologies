import { BoltIcon, CurrencyRupeeIcon, HeartIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Illustration from '@/components/ui/Illustration';

const proof = [
  { icon: BoltIcon, text: 'Ready in about a minute' },
  { icon: CurrencyRupeeIcon, text: 'Priced per vCPU, GB and disk' },
  { icon: HeartIcon, text: 'A real person answers' },
];

export default function Hero() {
  return (
    <section className="bg-[radial-gradient(60%_50%_at_80%_0%,rgb(var(--accent-soft)),transparent)]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">
            Hosting that stays out of your way
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            A server for every idea, priced the way you build it.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Most hosting asks you to pick from a menu and hope it fits. We started KB Cloud Technologies after one
            too many midnight plan upgrades, so you choose the vCPU, memory and disk, and watch the monthly price move as
            you go.
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            No surprises on the invoice, no dashboard maze, and your data stays in India.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#build" size="lg">
              Build your server
            </Button>
            <Button href="#plans" variant="secondary" size="lg">
              See plans
            </Button>
          </div>
          <ul className="mt-10 grid gap-3 text-sm text-ink-soft sm:grid-cols-3">
            {proof.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" width={20} height={20} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-primary-soft">
            <Illustration name="hills" className="h-64 w-full sm:h-80 lg:h-[26rem]" />
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lift sm:left-8">
            <CheckCircleIcon className="h-6 w-6 text-ok" width={24} height={24} aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-ink">api-server</p>
              <p className="text-xs text-ink-muted">Running · health 94 · Mumbai</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
