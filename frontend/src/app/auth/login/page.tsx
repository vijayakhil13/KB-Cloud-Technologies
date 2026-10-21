import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to see how your servers are doing."
      quote={{
        text: 'Servers that quietly work, and a real person to call when they do not.',
        by: 'The KB Cloud Technologies promise',
      }}
      footer={
        <>
          New here?{' '}
          <Link href="/auth/register" className="font-medium text-primary-ink underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
