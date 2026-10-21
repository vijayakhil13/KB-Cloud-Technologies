import type { ReactNode } from 'react';

/**
 * Shared card shell for the dashboard design system:
 * white surface, rounded-2xl, subtle border + shadow.
 */
export default function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
