import {
  WindowIcon,
  ServerStackIcon,
  ComputerDesktopIcon,
  CalculatorIcon,
  Squares2X2Icon,
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    icon: WindowIcon,
    title: 'Windows Server Hosting',
    description:
      'Run your Windows applications in the cloud with secure remote access.',
  },
  {
    icon: ServerStackIcon,
    title: 'Linux Server Hosting',
    description:
      'Powerful Linux servers for web, databases and custom applications.',
  },
  {
    icon: ComputerDesktopIcon,
    title: 'Remote Desktop Access',
    description: 'Access your server from any device through a web browser.',
  },
  {
    icon: CalculatorIcon,
    title: 'Tally Prime Hosting',
    description: 'Run Tally Prime in the cloud with secure multi-user access.',
  },
  {
    icon: Squares2X2Icon,
    title: 'Business Application Hosting',
    description:
      'Host your accounting, ERP and business software with expert support.',
  },
  {
    icon: CloudArrowDownIcon,
    title: 'Backup & Recovery',
    description: 'Regular backups and data recovery support.',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-page py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Our Services
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Flexible cloud solutions for your business needs
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-6 flex flex-col"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <service.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {service.description}
              </p>
              <a
                href="#contact"
                className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark transition-colors"
              >
                Learn More
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
