import Link from 'next/link';
import type { SVGProps } from 'react';
import {
  CpuChipIcon,
  CircleStackIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/outline';

type Plan = {
  name: string;
  audience: string;
  price: string;
  popular?: boolean;
  features: { icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode; label: string }[];
};

const plans: Plan[] = [
  {
    name: 'Starter',
    audience: 'For small businesses',
    price: '1,999',
    features: [
      { icon: CpuChipIcon, label: '2 vCPU' },
      { icon: CircleStackIcon, label: '4 GB RAM' },
      { icon: ComputerDesktopIcon, label: '100 GB SSD Storage' },
      { icon: WindowIcon, label: 'Windows | Linux' },
      { icon: ArrowDownTrayIcon, label: 'Basic Backup' },
      { icon: EnvelopeIcon, label: 'Email Support' },
    ],
  },
  {
    name: 'Business',
    audience: 'For growing businesses',
    price: '3,999',
    popular: true,
    features: [
      { icon: CpuChipIcon, label: '4 vCPU' },
      { icon: CircleStackIcon, label: '8 GB RAM' },
      { icon: ComputerDesktopIcon, label: '250 GB SSD Storage' },
      { icon: WindowIcon, label: 'Windows / Linux' },
      { icon: ClockIcon, label: 'Daily Backup' },
      { icon: ChatBubbleLeftRightIcon, label: 'Priority Support' },
    ],
  },
  {
    name: 'Advanced',
    audience: 'For high performance',
    price: '7,999',
    features: [
      { icon: CpuChipIcon, label: '8 vCPU' },
      { icon: CircleStackIcon, label: '16 GB RAM' },
      { icon: ComputerDesktopIcon, label: '500 GB SSD Storage' },
      { icon: WindowIcon, label: 'Windows / Linux' },
      { icon: ShieldCheckIcon, label: 'Advanced Backup' },
      { icon: LifebuoyIcon, label: '24/7 Support' },
    ],
  },
];

function WindowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75 10.5 5.4v6.15H3.75V6.75Zm8.25-1.5 8.25-1.65v7.8H12V5.25ZM3.75 13.05h6.75v6.15l-6.75-1.35v-4.8Zm8.25 0h8.25v7.8L12 19.2v-6.15Z"
      />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Hosting Plans
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Choose the right plan for your business
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch lg:px-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-2xl border bg-white overflow-hidden shadow-sm transition-all hover:-translate-y-1 ${
                plan.popular
                  ? 'border-brand shadow-xl shadow-brand/10 ring-2 ring-brand/30 lg:scale-105'
                  : 'border-gray-200 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="bg-brand py-2 text-center text-xs font-semibold uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.audience}</p>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">
                    &#8377;{plan.price}
                  </span>
                  <span className="text-sm text-gray-500">/month</span>
                </p>

                <Link
                  href="/auth/register"
                  className={`mt-5 block rounded-lg py-2.5 text-center text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${plan.popular ? 'bg-brand text-white hover:bg-brand-dark' : 'border border-brand text-brand hover:bg-brand-50'}`}
                >
                  Get Started
                </Link>

                <ul className="mt-6 space-y-3 border-t border-gray-200 pt-5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand">
                        <feature.icon className="h-4 w-4" />
                      </span>
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <CheckBadgeIcon className="h-5 w-5 text-green-500" />
          All plans include a 30-day money-back guarantee. No hidden charges.
        </p>
      </div>
    </section>
  );
}
