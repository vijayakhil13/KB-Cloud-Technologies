import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/dashboard/PageHeader';

/**
 * Placeholder content — wire up to the support API later.
 */
const options = [
  {
    title: 'Submit a Ticket',
    caption: 'Raise a support request',
    icon: TicketIcon,
  },
  {
    title: 'Knowledge Base',
    caption: 'Find helpful guides',
    icon: BookOpenIcon,
  },
  {
    title: 'Live Chat',
    caption: 'Chat with our team',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Contact Us',
    caption: 'Get in touch',
    icon: EnvelopeIcon,
  },
];

const faqs = [
  {
    question: 'How do I access my server?',
    answer:
      'Open the My Server page and click Connect. A secure remote desktop (RDP) session will start from your browser — no client install needed.',
  },
  {
    question: 'Can I upgrade my plan?',
    answer:
      'Yes. From the My Account page you can move to a higher plan at any time; the difference is prorated for the rest of the billing cycle.',
  },
  {
    question: 'Do you provide backups?',
    answer:
      'Daily automatic backups are included on Growth plans and above. You can also trigger an on-demand backup from the My Server page.',
  },
  {
    question: 'What applications can I run?',
    answer:
      'Any standard Windows or Linux workload — Tally, ERP, accounting tools, web servers and databases are all commonly hosted on CloudHost.',
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        subtitle="We are here to help you"
      />

      {/* Support channels */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => (
          <button
            key={option.title}
            type="button"
            className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1a6ef5]">
              <option.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-gray-900">
              {option.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">{option.caption}</p>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="mt-4 divide-y divide-gray-100">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-gray-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
