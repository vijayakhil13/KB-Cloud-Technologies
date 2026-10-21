/**
 * Colored progress bar used across the dashboard.
 * Percent is clamped to 0-100 before rendering.
 */
const barColors: Record<string, string> = {
  green: 'bg-[#22c55e]',
  amber: 'bg-[#f59e0b]',
  blue: 'bg-[#1a6ef5]',
  red: 'bg-[#ef4444]',
};

export default function UsageBar({
  percent,
  color = 'blue',
  className = '',
}: {
  percent: number;
  color?: keyof typeof barColors | string;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  const fill = barColors[color] ?? barColors.blue;

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${fill} transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
