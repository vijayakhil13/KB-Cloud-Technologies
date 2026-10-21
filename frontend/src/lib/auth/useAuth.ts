'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService, getAccessToken, type User } from '@/lib/api/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      if (!getAccessToken()) {
        // No access token (cleared/expired storage): the httpOnly refresh cookie may still be valid.
        await authService.refreshToken();
      }
      const data = await authService.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { user, loading, reload };
};

export const useRequireAuth = () => useAuth();
