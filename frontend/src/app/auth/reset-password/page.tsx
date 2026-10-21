import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Skeleton from '@/components/ui/Skeleton';

export const metadata: Metadata = { title: 'Choose a new password' };

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Pick something strong that you have not used elsewhere."
      footer={
        <>
          Back to{' '}
          <Link href="/auth/login" className="font-medium text-primary-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
