'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: 'How do I access my server?',
    answer:
      'Once your server is provisioned, you can access it from any device using a web browser or a standard remote desktop client. Simply log in to your CloudHost dashboard, select your server and click Connect — your remote session starts instantly.',
  },
  {
    question: 'Can I upgrade my plan?',
    answer:
      'Yes. You can upgrade or downgrade your plan at any time from your dashboard. Upgrades take effect within minutes with no data loss, and billing is prorated so you only pay for what you use.',
  },
  {
    question: 'Do you provide backups?',
    answer:
      'Every plan includes automated backups. Starter plans get basic weekly backups, while Business and Advanced plans include daily and advanced backups with one-click restore. You can also download backup snapshots anytime.',
  },
  {
    question: 'What applications can I run?',
    answer:
      'You can run virtually any Windows or Linux application — including Tally Prime, ERP systems, accounting software, web servers, databases and custom business applications. Our team will help you set up your software at no extra cost.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. All data is encrypted in transit and at rest, our data centers are ISO 27001 certified, and we perform regular security audits and 24/7 monitoring to keep your business data protected.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-12 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold tracking-tight text-gray-900 text-center">
        Frequently Asked Questions
      </h3>

      <div className="mt-6 space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
