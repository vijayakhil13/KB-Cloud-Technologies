import { ClockIcon, DocumentTextIcon, ServerStackIcon, WalletIcon } from '@heroicons/react/24/outline';
import PageHeader from '@/components/dashboard/PageHeader';

/**
 * Placeholder data — swap with the billing API later.
 */
const charges = [
  {
    label: 'Current Month Charges',
    value: '₹2,499',
    caption: 'Estimate so far · June 2026',
    icon: WalletIcon,
    tone: 'bg-blue-50 text-[#1a6ef5]',
  },
  {
    label: 'Compute Hours',
    value: '240 hrs',
    caption: 'of 744 hrs included in plan',
    icon: ClockIcon,
    tone: 'bg-green-50 text-green-600',
  },
  {
    label: 'Storage',
    value: '112 GB',
    caption: '₹1.20 per extra GB after 250 GB',
    icon: ServerStackIcon,
    tone: 'bg-amber-50 text-amber-500',
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Usage"
        subtitle="Charges and usage for your account"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {charges.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {item.value}
            </p>
            <p className="mt-2 text-xs text-gray-500">{item.caption}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Invoice History
        </h2>
        <div className="flex flex-col items-center py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            <DocumentTextIcon className="h-6 w-6 text-gray-400" />
          </span>
          <p className="mt-4 text-sm font-semibold text-gray-900">
            No invoices yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            Invoices appear here after your first billing cycle completes.
          </p>
        </div>
      </div>
    </div>
  );
}
