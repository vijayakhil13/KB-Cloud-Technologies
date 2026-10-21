import {
  TicketIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const channels = [
  {
    icon: TicketIcon,
    title: 'Submit a Ticket',
    description: 'Raise a support request',
  },
  {
    icon: BookOpenIcon,
    title: 'Knowledge Base',
    description: 'Find helpful guides',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Live Chat',
    description: 'Chat with our team',
  },
  {
    icon: EnvelopeIcon,
    title: 'Contact Us',
    description: 'Get in touch',
  },
];

export default function Support() {
  return (
    <section id="support" className="scroll-mt-16 bg-page py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Get Support
          </h2>
          <p className="mt-3 text-base text-gray-500">
            We are here to help you
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {channels.map((channel) => (
            <a
              key={channel.title}
              href="#contact"
              className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-6 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <channel.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                {channel.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {channel.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
