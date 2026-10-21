import { cn } from '@/lib/cn';

type Tone = 'default' | 'sand' | 'tint';
type Pad = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li' | 'aside';
  padding?: Pad;
  interactive?: boolean;
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  default: 'bg-surface',
  sand: 'bg-accent-soft',
  tint: 'bg-primary-soft',
};
const pads: Record<Pad, string> = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-6 sm:p-8' };

export default function Card({
  as: Tag = 'div',
  padding = 'md',
  interactive,
  tone = 'default',
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-card border border-border shadow-soft',
        tones[tone],
        pads[padding],
        interactive && 'transition hover:shadow-lift hover:-translate-y-0.5',
        className
      )}
      {...rest}
    />
  );
}
export { Card };
