'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/authService';
import {
  CloudIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

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

  const inputClass =
    'block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1a6ef5] sm:text-sm';

  return (
    <div className="min-h-screen flex bg-[#f5f8fc]">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0b1626] via-[#101f35] to-[#0b1626] relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #1a6ef5 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, #1a6ef5 0 1px, transparent 1px 60px)',
          }}
        />
        <div className="relative flex items-center space-x-3">
          <span className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#1a6ef5]">
            <CloudIcon className="h-6 w-6 text-white" />
          </span>
          <span className="text-xl font-bold text-white">CloudHost</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Create Your Account
          </h1>
          <p className="text-gray-300 max-w-md">
            Start your cloud journey today — deploy Windows or Linux servers in
            minutes and manage everything from one dashboard.
          </p>
        </div>
        <ul className="relative space-y-3 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            Plans starting at ₹1,999/month
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1a6ef5]" />
            Tally, ERP and business app hosting
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            Daily backups and priority support
          </li>
        </ul>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="lg:hidden flex items-center space-x-3 mb-6">
              <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#1a6ef5]">
                <CloudIcon className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-bold text-gray-900">CloudHost</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Create Your Account
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1 mb-8">
              Start your cloud journey today
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      autoComplete="given-name"
                      placeholder="Your first name"
                      value={form.firstName}
                      onChange={set('firstName')}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      autoComplete="family-name"
                      placeholder="Your last name"
                      value={form.lastName}
                      onChange={set('lastName')}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={set('email')}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Create a password (min. 8 characters)"
                    value={form.password}
                    onChange={set('password')}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1a6ef5] py-2.5 text-sm font-semibold text-white hover:bg-[#0f57d0] focus:outline-none focus:ring-2 focus:ring-[#1a6ef5] focus:ring-offset-2 disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-[#1a6ef5] hover:text-[#0f57d0]"
              >
                Login
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-600">
              ← Back to CloudHost home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
