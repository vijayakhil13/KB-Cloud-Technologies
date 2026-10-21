import { cn } from '@/lib/cn';

export interface IllustrationProps {
  name: 'hills' | 'clouds' | 'rack';
  className?: string;
  title?: string;
}

function Cloud({ x, y, s = 1, className }: { x: number; y: number; s?: number; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={className}>
      <path d="M10 40a14 14 0 0 1 4-27 20 20 0 0 1 38-3 16 16 0 0 1 8 30z" />
    </g>
  );
}

function Rack({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="44" height="58" rx="8" className="fill-surface stroke-primary" strokeWidth="2.5" />
      {[10, 26, 42].map((o) => (
        <g key={o}>
          <rect x="7" y={o - 4} width="30" height="10" rx="4" className="fill-primary-soft" />
          <circle cx="13" cy={o + 1} r="2" className="fill-primary" />
          <rect x="20" y={o} width="12" height="2" rx="1" className="fill-primary/40" />
        </g>
      ))}
    </g>
  );
}

export default function Illustration({ name, className, title }: IllustrationProps) {
  const label = title;
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true as const };
  if (name === 'rack') {
    return (
      <svg viewBox="0 0 240 140" className={cn('block', className)} {...a11y}>
        <ellipse cx="120" cy="124" rx="90" ry="10" className="fill-primary-soft" />
        <Cloud x={20} y={20} s={0.9} className="fill-accent-soft" />
        <Cloud x={160} y={34} s={0.7} className="fill-primary-soft" />
        <Rack x={98} y={50} />
      </svg>
    );
  }
  if (name === 'clouds') {
    return (
      <svg viewBox="0 0 480 560" preserveAspectRatio="xMidYMid slice" className={cn('block', className)} {...a11y}>
        <g className="kb-float">
          <Cloud x={50} y={80} s={1.8} className="fill-surface" />
          <Cloud x={290} y={150} s={1.3} className="fill-surface" />
        </g>
        <circle cx="380" cy="80" r="34" className="fill-accent-soft" />
        <Cloud x={190} y={40} s={0.9} className="fill-accent-soft" />
        <path d="M0 400C80 340 160 340 240 380S400 420 480 350V560H0z" className="fill-accent-soft" />
        <path d="M0 450C100 400 200 410 280 440S420 470 480 420V560H0z" className="fill-primary/25" />
        <path d="M0 500C120 460 220 480 320 500S440 510 480 490V560H0z" className="fill-primary/40" />
        <g transform="translate(180 318) scale(1.4)">
          <Rack x={0} y={0} />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMax slice" className={cn('block', className)} {...a11y}>
      <circle cx="360" cy="90" r="40" className="fill-accent-soft" />
      <Cloud x={50} y={60} s={1.2} className="fill-surface" />
      <Cloud x={230} y={30} s={0.8} className="fill-surface" />
      <path d="M0 230C70 170 150 170 230 210S390 250 480 180V360H0z" className="fill-accent-soft" />
      <path d="M0 270C100 220 200 230 290 260S420 290 480 250V360H0z" className="fill-primary/25" />
      <path d="M0 320C110 285 220 295 330 315S440 330 480 315V360H0z" className="fill-primary/45" />
      <g strokeLinecap="round" className="stroke-primary" strokeWidth="3" fill="none">
        <path d="M140 262v-26M140 250l-9-9M140 244l9-9" />
        <path d="M330 292v-22M330 282l-8-8M330 276l8-8" />
      </g>
    </svg>
  );
}
export { Illustration };
