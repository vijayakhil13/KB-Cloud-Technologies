'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { authService } from '@/lib/api/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const COOLDOWN_SECONDS = 30;

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError('Enter a valid email address.');
      return;
    }
    setFieldError(undefined);
    void send();
  };

  if (sent) {
    return (
      <div className="space-y-5" role="status" aria-live="polite">
        <div className="rounded-2xl bg-primary-soft p-5 text-primary-ink">
          <EnvelopeIcon className="h-6 w-6" width={24} height={24} aria-hidden="true" />
          <h2 className="mt-3 font-display text-xl font-medium">Check your inbox</h2>
          <p className="mt-1 text-sm">
            If an account exists for <strong className="font-medium">{email.trim()}</strong>, we have sent a link to
            reset your password. It may take a minute to arrive, so check spam too.
          </p>
        </div>
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg bg-crit-soft p-3 text-sm text-crit">
            <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" width={16} height={16} aria-hidden="true" />
            {error}
          </div>
        )}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={cooldown > 0 || loading}
          onClick={() => void send()}
        >
          {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend email'}
        </Button>
        <Button href="/auth/login" variant="ghost" className="w-full">
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={loading}>
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg bg-crit-soft p-3 text-sm text-crit">
          <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" width={16} height={16} aria-hidden="true" />
          {error}
        </div>
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldError}
        readOnly={loading}
      />
      <Button type="submit" size="lg" loading={loading} className="w-full">
        {loading ? 'Sending' : 'Send reset link'}
      </Button>
      <p className="text-center text-sm">
        <Link href="/auth/login" className="font-medium text-primary-ink underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
