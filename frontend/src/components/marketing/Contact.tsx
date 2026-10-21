'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const officeDetails = [
  {
    icon: MapPinIcon,
    label: 'Address',
    lines: ['321 Cloud Street, Tech Park', 'Bengaluru, India - 560001'],
  },
  {
    icon: PhoneIcon,
    label: 'Phone',
    lines: ['+91 98765 43210'],
  },
  {
    icon: EnvelopeIcon,
    label: 'Email',
    lines: ['support@cloudhost.com'],
  },
  {
    icon: ClockIcon,
    label: 'Working Hours',
    lines: ['Mon - Sat: 9:00 AM - 8:00 PM'],
  },
];

const inputClasses =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-colors';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="scroll-mt-16 bg-page py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Contact Us
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Let's talk about your needs
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-3 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-500">
                  <PaperAirplaneIcon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Message sent!
                </h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  Thank you for reaching out. Our team will get back to you
                  within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    defaultValue=""
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Select topic
                    </option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="technical">Technical Support</option>
                    <option value="migration">Server Migration</option>
                    <option value="billing">Billing Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Write your message..."
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-lg bg-brand px-8 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Office card */}
          <div className="lg:col-span-2 rounded-2xl bg-navy shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">Our Office</h3>
            <ul className="mt-6 space-y-5">
              {officeDetails.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      {item.label}
                    </span>
                    {item.lines.map((line) => (
                      <span
                        key={line}
                        className="block text-sm text-gray-400 mt-0.5"
                      >
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
