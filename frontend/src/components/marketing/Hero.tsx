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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Your Own Cloud.
            <br />
            Simple. Secure. Reliable.
          </h1>
          <p className="mt-5 text-lg text-gray-300 leading-relaxed">
            Windows & Linux cloud servers, remote desktops and business
            application hosting for your growing business.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-lg bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="#pricing"
              className="rounded-lg border border-navy-border bg-white/5 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 hover:border-gray-500 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
