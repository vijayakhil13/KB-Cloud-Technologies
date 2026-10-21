import { AdjustmentsHorizontalIcon, HeartIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';

const items = [
  {
    icon: AdjustmentsHorizontalIcon,
    title: 'Sized to fit, not to upsell',
    body: 'Pick exactly the cores, memory and disk your app needs. Change them later when it grows, and the price follows.',
    tone: 'default' as const,
  },
  {
    icon: MapPinIcon,
    title: 'Close to your customers',
    body: 'Servers in Mumbai, Chennai and Delhi keep latency low and your data inside India, where your compliance team wants it.',
    tone: 'tint' as const,
  },
  {
    icon: HeartIcon,
    title: 'People who pick up',
    body: 'Stuck at 2 am? Our engineers answer chats and calls around the clock, and they will not read you a script.',
    tone: 'sand' as const,
  },
];

export default function Features() {
  return (
    <section id="why" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">Why KB Cloud Technologies</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Hosting should feel like a quiet room, not a control tower
          </h2>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, body, tone }) => (
            <li key={title} className="flex">
              <Card tone={tone} padding="lg" className="w-full">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-surface text-primary">
                  <Icon className="h-6 w-6" width={24} height={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-medium text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
