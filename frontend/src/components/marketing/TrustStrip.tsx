import { ShieldCheckIcon, MapPinIcon, ChatBubbleLeftRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const items = [
  { icon: ShieldCheckIcon, text: '99.95% uptime SLA' },
  { icon: MapPinIcon, text: 'Data in India' },
  { icon: ChatBubbleLeftRightIcon, text: '24/7 human support' },
  { icon: CalendarDaysIcon, text: 'Pay monthly, cancel anytime' },
];

export default function TrustStrip() {
  return (
    <section aria-label="Our promises" className="border-y border-border bg-surface">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-4 px-5 py-6 text-ink-soft sm:px-8 lg:justify-between">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5 text-sm font-medium sm:text-base">
            <Icon className="h-5 w-5 shrink-0 text-primary" width={20} height={20} aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
