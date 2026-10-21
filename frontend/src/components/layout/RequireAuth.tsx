'use client';

import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/auth/useAuth';
import type { User } from '@/lib/api/authService';
import { Spinner } from '@/components/ui/Button';

const UserContext = createContext<User | null>(null);

/** The signed-in user, fetched once by RequireAuth via useAuth. */
export const useCurrentUser = (): User | null => useContext(UserContext);

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
      <div className="flex min-h-screen items-center justify-center bg-bg" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3 text-sm text-ink-soft">
          <Spinner className="h-8 w-8 text-primary" />
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
