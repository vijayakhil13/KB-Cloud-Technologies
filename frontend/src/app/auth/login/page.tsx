'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/authService';
import {
  CloudIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
            <CloudIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <span className="text-xl font-bold text-white">CloudHost</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Your Own Cloud.
            <br />
            Simple. Secure. Reliable.
          </h1>
          <p className="text-gray-300 max-w-md">
            Access your cloud server account to manage VMs, monitor performance
            and connect to your remote desktop.
          </p>
        </div>
        <ul className="relative space-y-3 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            Windows & Linux servers ready in minutes
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1a6ef5]" />
            Remote desktop access from anywhere
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            Secure & reliable — your data, our priority
          </li>
        </ul>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="lg:hidden flex items-center space-x-3 mb-6">
              <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#1a6ef5]">
                <CloudIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold text-gray-900">CloudHost</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Client Login
            </h2>
            <p className="text-sm text-gray-500 text-center mt-1 mb-8">
              Access your cloud server account
            </p>

            {error && (
              <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1a6ef5] sm:text-sm"
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
                  <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1a6ef5] sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#1a6ef5] focus:ring-[#1a6ef5]"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="font-medium text-[#1a6ef5] hover:text-[#0f57d0]"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1a6ef5] py-2.5 text-sm font-semibold text-white hover:bg-[#0f57d0] focus:outline-none focus:ring-2 focus:ring-[#1a6ef5] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-[#1a6ef5] hover:text-[#0f57d0]"
              >
                Sign up
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
