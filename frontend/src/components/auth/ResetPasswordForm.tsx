'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { ApiError, authService } from '@/lib/api/authService';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import PasswordField from './PasswordField';
import PasswordStrength, { evaluatePassword } from './PasswordStrength';

const REDIRECT_DELAY_MS = 2500;

function LinkProblem({ message }: { message: string }) {
  return (
    <div className="space-y-5">
      <div role="alert" className="flex items-start gap-2 rounded-lg bg-crit-soft p-3 text-sm text-crit">
        <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" width={16} height={16} aria-hidden="true" />
        {message}
      </div>
      <Button href="/auth/forgot-password" size="lg" className="w-full">
        Request a new link
      </Button>
      <p className="text-center text-sm">
        <Link href="/auth/login" className="font-medium text-primary-ink underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const toast = useToast();
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [badToken, setBadToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.push('/auth/login'), REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [done, router]);

  if (!token) {
    return <LinkProblem message="This reset link is missing its token. Request a new link to continue." />;
  }
  if (badToken) {
    return <LinkProblem message="This reset link is invalid or has expired. Request a new one to continue." />;
  }

  if (done) {
    return (
      <div className="space-y-5" role="status" aria-live="polite">
        <div className="rounded-2xl bg-ok-soft p-5 text-ok">
          <CheckCircleIcon className="h-6 w-6" width={24} height={24} aria-hidden="true" />
          <h2 className="mt-3 font-display text-xl font-medium">Password updated</h2>
          <p className="mt-1 text-sm">Taking you to sign in...</p>
        </div>
        <Button href="/auth/login" size="lg" className="w-full">
          Sign in now
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const next: typeof errors = {};
    if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    else if (evaluatePassword(password).score < 2) next.password = 'Password is too weak. Make it at least Fair.';
    if (password !== confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast({ title: 'Password updated', description: 'Sign in with your new password.', tone: 'ok' });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'INVALID_OR_EXPIRED_TOKEN') {
        setBadToken(true);
      } else {
        setError(err instanceof Error ? err.message : 'Could not reset your password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={loading}>
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg bg-crit-soft p-3 text-sm text-crit">
          <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" width={16} height={16} aria-hidden="true" />
          {error}
        </div>
      )}
      <div>
        <PasswordField
          label="New password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          aria-describedby="pw-strength"
          readOnly={loading}
        />
        <PasswordStrength password={password} id="pw-strength" />
      </div>
      <PasswordField
        label="Confirm new password"
        name="confirmPassword"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        readOnly={loading}
      />
      <Button type="submit" size="lg" loading={loading} className="w-full">
        {loading ? 'Updating' : 'Update password'}
      </Button>
    </form>
  );
}
