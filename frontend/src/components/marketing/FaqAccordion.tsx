'use client';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    q: 'How does billing work?',
    a: 'You pay monthly in rupees, based on the vCPU, memory and storage you choose, plus a flat licence fee for Windows. There are no setup fees, and the calculator above is the same formula we invoice with.',
  },
  {
    q: 'Which regions can I deploy in?',
    a: 'Mumbai, Chennai and Delhi. All three keep your data inside India. Pick the one closest to your users when you deploy.',
  },
  {
    q: 'Are my servers backed up?',
    a: 'Yes. Every server gets automatic daily backups that we keep for seven days, and you can restore from the dashboard or ask support to do it for you.',
  },
  {
    q: 'Can I resize a server later?',
    a: 'Absolutely. Scale cores, memory or disk up as you grow. Your monthly price updates to match from the next billing day.',
  },
  {
    q: 'What is your refund policy?',
    a: 'If KB Cloud Technologies is not right for you, cancel within 7 days of your first payment and we will refund it in full. After that you can cancel anytime and are billed only up to the end of the month.',
  },
  {
    q: 'How do Windows licences work?',
    a: 'Windows servers include a Windows Server licence for a flat Rs 800 per month. Linux servers have no licence fee. You can pick either when you build your server.',
  },
];

export default function FaqAccordion() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Questions people ask first
          </h2>
          <p className="mt-4 text-ink-soft">Not here? Write to us below and a person will reply.</p>
        </div>
        <div className="divide-y divide-border rounded-card border border-border bg-surface px-5 shadow-soft sm:px-8">
          {faqs.map((f) => (
            <Disclosure key={f.q} as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left font-medium text-ink">
                    {f.q}
                    <ChevronDownIcon
                      className={`h-5 w-5 shrink-0 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
                      width={20}
                      height={20}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pb-5 leading-relaxed text-ink-soft">{f.a}</Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
