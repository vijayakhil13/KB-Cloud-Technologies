import type { ComponentType, ReactNode } from 'react';
import UsageBar from './UsageBar';

type UsageCardProps = {
  /** Heroicons outline component */
  icon: ComponentType<{ className?: string }>;
  /** Icon tile tint classes, e.g. "bg-green-50 text-green-600" */
  iconTone: string;
  label: string;
  percent: number;
  /** Bar + percent color key */
  color: 'green' | 'amber' | 'blue' | 'red';
  /** Caption under the bar, e.g. "5 GB of 8 GB" */
  caption: ReactNode;
};

export default function UsageCard({
  icon: Icon,
  iconTone,
  label,
  percent,
  color,
  caption,
}: UsageCardProps) {
  const percentTone: Record<UsageCardProps['color'], string> = {
    green: 'text-[#22c55e]',
    amber: 'text-[#f59e0b]',
    blue: 'text-[#1a6ef5]',
    red: 'text-[#ef4444]',
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTone}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <p
        className={`mt-4 text-3xl font-bold ${percentTone[color]}`}
      >{`${percent}%`}</p>
      <UsageBar percent={percent} color={color} className="mt-3" />
      <p className="mt-3 text-xs text-gray-500">{caption}</p>
    </div>
  );
}
