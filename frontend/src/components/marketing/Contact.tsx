'use client';

import { useState } from 'react';
import { CheckCircleIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;
type Status = 'idle' | 'sending' | 'done' | 'error';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) e.message = 'A sentence or two helps us help you (10+ characters).';
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus('sending');
    try {
      await new Promise((r) => setTimeout(r, 700));
      const prev = JSON.parse(localStorage.getItem('ch-contacts') || '[]') as unknown[];
      localStorage.setItem('ch-contacts', JSON.stringify([...prev, { ...form, at: new Date().toISOString() }]));
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <section id="contact" className="scroll-mt-20 bg-surface-2/60 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary-ink">Contact</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Tell us what you are building
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
            Not sure which size fits? Share a few details and one of our engineers will suggest a setup, with no sales
            pitch attached.
          </p>
          <ul className="mt-8 space-y-4 text-ink">
            <li className="flex items-center gap-3">
              <EnvelopeIcon className="h-5 w-5 text-primary" width={20} height={20} aria-hidden="true" />
              <a href="mailto:support@kbcloudtechnologies.com" className="underline-offset-4 hover:underline">
                support@kbcloudtechnologies.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-primary" width={20} height={20} aria-hidden="true" />
              <a href="tel:+919876543210" className="underline-offset-4 hover:underline">
                +91 98765 43210
              </a>
            </li>
          </ul>
        </div>

        <Card padding="lg">
          {status === 'done' ? (
            <div role="status" className="py-8 text-center">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-ok" width={48} height={48} aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl font-medium text-ink">Thanks, we reply within one working day</h3>
              <p className="mt-2 text-ink-soft">Your note is with the team. Keep an eye on your inbox.</p>
              <Button
                variant="secondary"
                className="mt-6"
                onClick={() => {
                  setForm({ name: '', email: '', message: '' });
                  setStatus('idle');
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5" aria-busy={status === 'sending'}>
              <Input
                label="Your name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => set('name')(e.target.value)}
                error={errors.name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set('email')(e.target.value)}
                error={errors.email}
              />
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-ink">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => set('message')(e.target.value)}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'contact-message-err' : undefined}
                  className={`w-full rounded-lg border bg-surface px-3.5 py-3 text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 ${
                    errors.message ? 'border-crit' : 'border-border'
                  }`}
                />
                {errors.message && (
                  <p id="contact-message-err" className="mt-1.5 text-sm text-crit">
                    {errors.message}
                  </p>
                )}
              </div>
              {status === 'error' && (
                <div role="alert">
                  <Badge
                    tone="crit"
                    icon={<ExclamationTriangleIcon className="h-4 w-4" width={16} height={16} aria-hidden="true" />}
                  >
                    Something went wrong. Please try again.
                  </Badge>
                </div>
              )}
              <Button type="submit" loading={status === 'sending'} className="w-full sm:w-auto">
                {status === 'error' ? 'Retry' : 'Send message'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </section>
  );
}
