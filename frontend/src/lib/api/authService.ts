/**
 * Real API client for the auth backend.
 * Access token lives in localStorage; refresh token is an httpOnly
 * cookie managed by the backend (send credentials on every call).
 */

export interface User {
  id: string | number;
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

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface ErrorBody {
  error?: string;
  code?: string;
  errors?: { msg?: string }[];
}

let refreshing: Promise<void> | null = null;

async function doFetch(path: string, options: RequestInit): Promise<Response> {
  const token = getAccessToken();
  try {
    return await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Can't reach the server. Is the backend running on port 5000?", 0, 'NETWORK');
  }
}

async function request<T>(path: string, options: RequestInit = {}, retried = false): Promise<T> {
  const res = await doFetch(path, options);
  const data = (await res.json().catch(() => ({}))) as ErrorBody & T;

  if (!res.ok) {
    // One silent refresh + retry when the 30-minute access token has expired.
    if (res.status === 401 && data.code === 'TOKEN_EXPIRED' && !retried && !path.startsWith('/auth/')) {
      try {
        refreshing = refreshing ?? authService.refreshToken().then(() => undefined);
        await refreshing;
      } catch {
        setToken(null);
        throw new ApiError('Your session has expired. Please sign in again.', 401, 'TOKEN_EXPIRED');
      } finally {
        refreshing = null;
      }
      return request<T>(path, options, true);
    }

    // express-validator returns { errors: [{ msg, ... }] }
    const serverMessage = data.error || data.errors?.[0]?.msg;
    let message: string;
    if (res.status >= 500) {
      message = 'Something went wrong on our side, please try again';
    } else if (res.status === 401 && path === '/auth/login') {
      message =
        serverMessage && !/invalid email or password/i.test(serverMessage)
          ? serverMessage
          : 'Incorrect email or password';
    } else {
      message = serverMessage || `Request failed (${res.status})`;
    }
    throw new ApiError(message, res.status, data.code);
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

  forgotPassword: async (email: string): Promise<{ message: string }> =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: async (token: string, password: string): Promise<{ message: string }> =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  getMe: async (): Promise<{ user: User }> => request('/auth/me'),
};

export default authService;
