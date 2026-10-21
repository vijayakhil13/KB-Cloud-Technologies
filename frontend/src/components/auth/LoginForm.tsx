'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { authService } from '@/lib/api/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordField from './PasswordField';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await authService.login({ email, password });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        readOnly={loading}
        aria-disabled={loading}
      />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        readOnly={loading}
        aria-disabled={loading}
      />
      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-ink-soft">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          Remember me
        </label>
        <Link href="/auth/forgot-password" className="font-medium text-primary-ink underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" size="lg" loading={loading} className="w-full">
        {loading ? 'Signing in' : 'Sign in'}
      </Button>
    </form>
  );
}
