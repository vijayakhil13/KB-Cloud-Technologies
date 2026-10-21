import Link from 'next/link';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertItem = {
  id: number | string;
  severity: AlertSeverity;
  title: string;
  message: string;
  time: string;
};

const severityStyles: Record<
  AlertSeverity,
  { icon: typeof ExclamationTriangleIcon; tone: string }
> = {
  warning: {
    icon: ExclamationTriangleIcon,
    tone: 'bg-amber-50 text-amber-500',
  },
  critical: {
    icon: ExclamationCircleIcon,
    tone: 'bg-red-50 text-red-500',
  },
  info: {
    icon: InformationCircleIcon,
    tone: 'bg-blue-50 text-[#1a6ef5]',
  },
};

/**
 * Compact "Recent Alerts" list for the overview page.
 */
export default function AlertsList({ items }: { items: AlertItem[] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Recent Alerts</h2>
        <Link
          href="/dashboard/alerts"
          className="text-sm font-medium text-[#1a6ef5] hover:text-[#0f57d0]"
        >
          View All
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-gray-100">
        {items.map((item) => {
          const { icon: Icon, tone } = severityStyles[item.severity];
          return (
            <li
              key={item.id}
              className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <span className="shrink-0 text-xs text-gray-400">
                    {item.time}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-gray-500">
                  {item.message}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
