import Link from 'next/link';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Common {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export type ButtonProps = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined };
export type LinkButtonProps = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | 'href'> & { href: string };

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary-hover shadow-soft',
  secondary: 'bg-surface border border-border text-ink hover:bg-surface-2',
  ghost: 'text-ink-soft hover:bg-surface-2',
  danger: 'bg-crit-soft text-crit hover:brightness-95',
};
const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3.5 text-sm',
  md: 'min-h-11 px-5 text-sm sm:text-base',
  lg: 'min-h-12 px-7 text-base',
};

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4 animate-spin', className)}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity=".25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | LinkButtonProps>(
  function Button(props, ref) {
    const { variant = 'primary', size = 'md', loading, leftIcon, className, children, ...rest } = props;
    const cls = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition select-none',
      variants[variant],
      sizes[size],
      className
    );
    const inner = (
      <>
        {loading ? <Spinner /> : leftIcon}
        {children}
      </>
    );
    if ('href' in rest && rest.href !== undefined) {
      const { href, ...a } = rest as Omit<LinkButtonProps, keyof Common>;
      return (
        <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...a}>
          {inner}
        </Link>
      );
    }
    const { disabled, type = 'button', ...b } = rest as Omit<ButtonProps, keyof Common>;
    const off = disabled || loading;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={off}
        aria-busy={loading || undefined}
        className={cn(cls, off && 'opacity-50 cursor-not-allowed')}
        {...b}
      >
        {inner}
      </button>
    );
  }
);

export default Button;
export { Button };
