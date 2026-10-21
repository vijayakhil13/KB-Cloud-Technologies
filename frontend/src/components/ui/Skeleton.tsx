import { cn } from '@/lib/cn';

export default function Skeleton({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-lg bg-surface-2', className)} {...rest} />;
}
export { Skeleton };
