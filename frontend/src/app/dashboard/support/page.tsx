import type { Metadata } from 'next';
import {
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/dashboard/PageHeader';
import Card from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Support' };

const options = [
  { title: 'Submit a ticket', caption: 'Raise a support request', icon: TicketIcon },
  { title: 'Knowledge base', caption: 'Find helpful guides', icon: BookOpenIcon },
  { title: 'Live chat', caption: 'Chat with our team', icon: ChatBubbleLeftRightIcon },
  { title: 'Contact us', caption: 'Get in touch', icon: EnvelopeIcon },
];

const faqs = [
  {
    question: 'How do I access my server?',
    answer:
      'Open Servers, pick your server and use its IP address. Windows servers accept Remote Desktop (RDP); Linux servers accept SSH.',
  },
  {
    question: 'Can I resize a server?',
    answer:
      'Yes. Deploy a new size, move your data across and stop the old server. You only pay for what is running.',
  },
  {
    question: 'Do you provide backups?',
    answer: 'Daily snapshots are stored in your server region. You will see a confirmation in Alerts after each one.',
  },
  {
    question: 'What can I run on KB Cloud Technologies?',
    answer: 'Any standard Windows or Linux workload: web servers, databases, Tally, ERP and accounting tools.',
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Support" subtitle="Real people, available 24/7." />

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((o) => (
          <li key={o.title}>
            <Card as="div" interactive className="h-full">
              <button type="button" className="flex w-full flex-col text-left">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary-ink">
                  <o.icon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
                </span>
                <span className="mt-4 font-medium text-ink">{o.title}</span>
                <span className="mt-1 text-sm text-ink-soft">{o.caption}</span>
              </button>
            </Card>
          </li>
        ))}
      </ul>

      <Card as="section" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-xl font-medium text-ink">
          Frequently asked questions
        </h2>
        <div className="mt-2 divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.question} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.question}
                <ChevronDownIcon
                  className="h-5 w-5 shrink-0 text-ink-muted transition-transform group-open:rotate-180"
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-4 text-ink-soft">{f.answer}</p>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}
