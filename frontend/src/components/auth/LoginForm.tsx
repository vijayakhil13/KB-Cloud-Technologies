import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  loading?: boolean;
}

export default function LoginForm({
  onSubmit,
  loading = false
}: LoginFormProps) {
  const [formState, setFormState] = useState<{
    email: string;
    password: string;
    emailError: string | null;
    passwordError: string | null;
  }>({
    email: '',
    password: '',
    emailError: null,
    passwordError: null,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
      [name === 'email' ? 'emailError' : 'passwordError']: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const emailError = !formState.email
      ? 'Email is required'
      : !/\S+@\S+\.\S+/.test(formState.email)
        ? 'Email address is invalid'
        : null;

    const passwordError = !formState.password
      ? 'Password is required'
      : formState.password.length < 8
        ? 'Password must be at least 8 characters'
        : null;

    if (emailError || passwordError) {
      setFormState(prev => ({
        ...prev,
        emailError,
        passwordError,
      }));
      return;
    }

    try {
      await onSubmit({
        email: formState.email,
        password: formState.password,
      });

      // Clear form on success
      setFormState({
        email: '',
        password: '',
        emailError: null,
        passwordError: null,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      // Handle API error
      alert(error?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              formState.emailError ? 'ring-red-300' : ''
            }`}
            value={formState.email}
            onChange={handleChange}
          />
          {formState.emailError && (
            <p className="mt-2 text-sm text-red-600">{formState.emailError}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              formState.passwordError ? 'ring-red-300' : ''
            }`}
            value={formState.password}
            onChange={handleChange}
          />
          {formState.passwordError && (
            <p className="mt-2 text-sm text-red-600">{formState.passwordError}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50' : ''
          }`}
        >
          Sign in
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Signing up means you agree to our
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
          Terms of Service
        </a>
        and
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
          Privacy Policy
        </a>
        .
      </div>
    </form>
  );
}