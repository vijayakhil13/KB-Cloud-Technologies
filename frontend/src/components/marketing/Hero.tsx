import Link from 'next/link';
import {
  CommandLineIcon,
  ComputerDesktopIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const badges = [
  {
    icon: CommandLineIcon,
    title: 'Windows & Linux Servers',
    subtitle: 'Ready in minutes',
  },
  {
    icon: ComputerDesktopIcon,
    title: 'Remote Desktop',
    subtitle: 'Access from anywhere',
  },
  {
    icon: BuildingOffice2Icon,
    title: 'Business Applications',
    subtitle: 'Tally, ERP and more',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Reliable',
    subtitle: 'Your data, our priority',
  },
];

export default function Hero() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-navy"
    >
      {/* Subtle gradient / texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-navy-light via-navy to-navy-lighter"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_rgba(26,110,245,0.35),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(26,110,245,0.18),_transparent_50%)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-border bg-white/5 px-3 py-1 text-xs font-medium text-brand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
              99.9% uptime on every plan
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Own Cloud.{' '}
              <span className="bg-gradient-to-r from-primary-300 to-brand bg-clip-text text-transparent">
                Simple. Secure. Reliable.
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-300 leading-relaxed">
              Windows & Linux cloud servers, remote desktops and business
              application hosting for your growing business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/auth/register"
                className="rounded-lg bg-brand px-7 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                Get Started
              </Link>
              <Link
                href="#pricing"
                className="rounded-lg border border-navy-border bg-white/5 px-7 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 hover:border-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                View Plans
              </Link>
            </div>
          </div>

          {/* Decorative server illustration */}
          <div aria-hidden="true" className="hidden lg:block mx-auto w-full max-w-md">
            <svg viewBox="0 0 400 320" fill="none" className="h-auto w-full">
              <ellipse cx="200" cy="290" rx="150" ry="14" fill="#1a6ef5" opacity="0.15" />
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(0 ${i * 88})`}>
                  <rect x="60" y="20" width="280" height="72" rx="14" fill="#101f35" stroke="#22344f" strokeWidth="2" />
                  <rect x="80" y="40" width="120" height="8" rx="4" fill="#22344f" />
                  <rect x="80" y="58" width="80" height="8" rx="4" fill="#16294a" />
                  <circle cx="290" cy="46" r="6" fill="#4ade80" />
                  <circle cx="312" cy="46" r="6" fill="#1a6ef5" />
                  <rect x="270" y="62" width="50" height="6" rx="3" fill="#22344f" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-3 rounded-xl border border-navy-border bg-white/5 px-4 py-4 hover:bg-white/10 transition-colors"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                <badge.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  {badge.title}
                </span>
                <span className="block text-xs text-gray-400">
                  {badge.subtitle}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
