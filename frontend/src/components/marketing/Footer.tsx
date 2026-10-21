import Link from 'next/link';
import { CloudIcon } from '@heroicons/react/24/solid';

const columns = [
  {
    heading: 'Services',
    links: [
      { label: 'Windows Server Hosting', href: '#services' },
      { label: 'Linux Server Hosting', href: '#services' },
      { label: 'Remote Desktop Access', href: '#services' },
      { label: 'Tally Prime Hosting', href: '#services' },
      { label: 'Backup & Recovery', href: '#services' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Submit a Ticket', href: '#support' },
      { label: 'Knowledge Base', href: '#support' },
      { label: 'Live Chat', href: '#support' },
      { label: 'FAQs', href: '#support' },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="security" className="bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="#" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                <CloudIcon className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                CloudHost
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-400 leading-relaxed">
              Simple, secure and reliable cloud server hosting for growing
              businesses. Your data, our priority.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.heading}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                {column.heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-navy-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} CloudHost. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Secure servers hosted in ISO 27001 certified data centers.
          </p>
        </div>
      </div>
    </footer>
  );
}
