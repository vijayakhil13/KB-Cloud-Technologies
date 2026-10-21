/**
 * Real API client for the auth backend.
 * Access token lives in localStorage; refresh token is an httpOnly
 * cookie managed by the backend (send credentials on every call).
 */

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'accessToken';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // storage unavailable (private mode etc.) — auth still works per-session
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // express-validator returns { errors: [{ msg, ... }] }
    const message =
      data.error || data.errors?.[0]?.msg || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export const authService = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ message: string; user: User }> =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ message: string; user: User; accessToken: string }> => {
    const data = await request<{ user: User; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setToken(data.accessToken);
    return { message: 'Login successful', ...data };
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      setToken(null);
    }
    return { message: 'Logged out successfully' };
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const data = await request<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
    });
    setToken(data.accessToken);
    return data;
  },

  getMe: async (): Promise<{ user: User }> => request('/auth/me'),
};

export default authService;
