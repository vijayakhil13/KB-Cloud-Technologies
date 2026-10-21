'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { authService } from '@/lib/api/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordField from './PasswordField';
import PasswordStrength, { evaluatePassword } from './PasswordStrength';

type Field = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword' | 'terms';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const next: Partial<Record<Field, string>> = {};
    if (!form.firstName.trim()) next.firstName = 'Enter your first name.';
    if (!form.lastName.trim()) next.lastName = 'Enter your last name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters.';
    else if (evaluatePassword(form.password).score < 2) next.password = 'Password is too weak. Make it at least Fair.';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    if (!terms) next.terms = 'Please accept the terms to continue.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await authService.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="First name" name="firstName" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} error={errors.firstName} readOnly={loading} />
        <Input label="Last name" name="lastName" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} error={errors.lastName} readOnly={loading} />
      </div>
      <Input label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} readOnly={loading} />
      <div>
        <PasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          aria-describedby="pw-strength"
          readOnly={loading}
        />
        <PasswordStrength password={form.password} id="pw-strength" />
      </div>
      <PasswordField
        label="Confirm password"
        name="confirmPassword"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={set('confirmPassword')}
        error={errors.confirmPassword}
        readOnly={loading}
      />
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? 'terms-err' : undefined}
            className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
          />
          I agree to the KB Cloud Technologies terms of service and privacy policy.
        </label>
        {errors.terms && (
          <p id="terms-err" className="mt-1 flex items-start gap-1.5 text-sm text-crit">
            <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" width={16} height={16} aria-hidden="true" />
            {errors.terms}
          </p>
        )}
      </div>
      <Button type="submit" size="lg" loading={loading} className="w-full">
        {loading ? 'Creating account' : 'Create account'}
      </Button>
    </form>
  );
}
