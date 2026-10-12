import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // In a real app, this would call an API endpoint like /api/auth/me
        // For now, we'll simulate checking for a token
        const token = localStorage.getItem('accessToken');
        if (token) {
          // In a real app, you'd validate the token and fetch user data
          // This is a simplified version
          setUser({
            id: '1',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'customer'
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
};

export const useRequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Still checking

  if (!user) {
    // Redirect to login
    // Note: In a real implementation, you'd use router.push here
    // but we can't access router in this hook without parameters
    return null;
  }

  return user;
};