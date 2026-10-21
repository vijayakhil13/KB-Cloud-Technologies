'use client';

import { useRequireAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-page"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3 text-sm text-gray-500">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand" />
          Loading your dashboard…
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return <>{children}</>;
};
