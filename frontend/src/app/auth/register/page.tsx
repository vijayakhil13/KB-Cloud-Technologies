import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = { title: 'Create your account' };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Your first server takes about a minute to set up."
      quote={{
        text: 'Pay monthly, cancel anytime, and your data stays in India.',
        by: 'The KB Cloud Technologies promise',
      }}
      footer={
        <>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
