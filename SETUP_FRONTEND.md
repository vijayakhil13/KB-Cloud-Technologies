# Cloud Hosting Platform Frontend Setup Guide

This guide provides instructions for setting up the frontend application for the cloud hosting platform using React/Next.js with TypeScript, as specified in the Senior Frontend Agent's planning documents.

## What We're Building

The frontend application will be a dashboard where users can:
- Log in and manage their sessions
- View and manage their virtual machines
- Monitor server metrics (CPU, RAM, storage)
- Set up and manage alerts
- View billing and usage information
- Access remote desktops via Apache Guacamole integration
- Submit support tickets

## Technology Stack

- **Framework**: Next.js 13+ with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (for server state) + Zustand/Jotai (for client state)
- **UI Components**: Headless UI + Heroicons
- **Data Visualization**: Chart.js/Recharts
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **HTTP Client**: Axios or Fetch API
- **Authentication**: JWT token handling (access tokens in memory, refresh tokens in cookies)

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 13+ app router
│   │   ├── (dashboard)/        # Protected routes
│   │   │   ├── layout.tsx      # Dashboard layout
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── vms/            # VM management
│   │   │   │   ├── page.tsx    # VM list
│   │   │   │   ├── [id]/       # Individual VM
│   │   │   │   │   └── page.tsx
│   │   │   ├── monitoring/     # Monitoring dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── alerts/         # Alert management
│   │   │   │   └── page.tsx
│   │   │   ├── profile/        # User profile
│   │   │   │   └── page.tsx
│   │   │   └── billing/        # Billing & usage
│   │   │       └── page.tsx
│   │   ├── auth/               # Public auth routes
│   │   │   ├── login/          # Login page
│   │   │   │   └── page.tsx
│   │   │   ├── register/       # Register page
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/ # Password reset
│   │   │       └── page.tsx
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page (landing)
│   ├── components/             # Reusable UI components
│   │   ├── layout/             # Layout components (header, sidebar, etc.)
│   │   ├── ui/                 # Basic UI elements (buttons, inputs, etc.)
│   │   ├── widgets/            # Dashboard widgets (stats, charts, etc.)
│   │   └── forms/              # Form components
│   ├── lib/                    # Utilities and helpers
│   │   ├── api/                # API service layer
│   │   ├── auth/               # Auth helpers
│   │   ├── utils/              # General utilities
│   │   └── hooks/              # Custom React hooks
│   ├── styles/                 # CSS/Tailwind configuration
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Setup and usage instructions
```

## Setup Instructions

### 1. Create the Frontend Project

```bash
# From the project root
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"
cd frontend
```

### 2. Install Additional Dependencies

```bash
npm install @heroicons/react @headlessui/react zod react-hook-form
npm install recharts chart.js date-fns
npm install axios  # or you can use fetch API
# For state management (choose one):
npm install zustand  # lightweight
# or
npm install jotai    # minimal
# or both for different use cases
```

### 3. Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Add your brand colors here
      },
      borderRadius: {
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [],
}
```

### 4. Create Environment Variables

Create `.env.local` in the frontend directory:

```env
# Next.js
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Google Analytics, etc.
# NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### 5. Key Components to Build

Based on the Senior Frontend Agent's planning documents, here are the key components to implement:

#### Authentication Components
- `src/components/auth/LoginForm.tsx` - Login form with email/password
- `src/components/auth/RegisterForm.tsx` - Registration form
- `src/components/auth/ResetPasswordForm.tsx` - Password reset

#### Dashboard Layout
- `src/components/layout/Header.tsx` - Top navigation with user menu
- `src/components/layout/Sidebar.tsx` - Navigation sidebar (collapsible)
- `src/components/layout/Footer.tsx` - Application footer

#### VM Management Components
- `src/components/widgets/VMCardsGrid.tsx` - Grid showing user's VMs
- `src/components/widgets/VMSingleView.tsx` - Detailed view of a single VM
- `src/components/widgets/VMActions.tsx` - Start/stop/restart/delete buttons
- `src/components/widgets/VMCreationModal.tsx` - Form to create new VM

#### Monitoring Components
- `src/components/widgets/CPUChart.tsx` - CPU usage over time
- `src/components/widgets/MemoryChart.tsx` - Memory usage over time
- `src/components/widgets/StorageChart.tsx` - Storage usage over time
- `src/components/widgets/MetricsGrid.tsx` - Key metrics display

#### Alert Components
- `src/components/widgets/AlertsList.tsx` - List of active alerts
- `src/components/widgets/AlertCreationForm.tsx` - Form to create new alerts
- `src/components/widgets/AlertNotificationBadge.tsx` - Badge showing alert count

#### Remote Access Components
- `src/components/widgets/GuacamoleConnector.tsx` - Launches Guacamole connection
- `src/components/widgets/RemoteAccessInstructions.tsx` - How to connect

#### Forms Components
- `src/components/forms/ValidatedForm.tsx` - Form wrapper with React Hook Form
- `src/components/forms/ZodResolver.tsx` - Zod validation integration
- `src/components/forms/ButtonLoading.tsx` - Button with loading state

### 6. API Service Layer

Create `src/lib/api/authService.ts` for authentication:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add request interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('refreshToken='))
          ?.split('=')[1];
        
        if (refreshToken) {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {}, // No body needed, cookie will be sent
            { withCredentials: true }
          );
          
          localStorage.setItem('accessToken', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => 
    api.post('/auth/login', credentials, { withCredentials: true }),
  logout: () => api.post('/auth/logout', {}, { withCredentials: true }),
  refreshToken: () => 
    api.post('/auth/refresh', {}, { withCredentials: true }),
  getMe: () => api.get('/auth/me'),
};

export default api;
```

### 7. Authentication Hooks

Create `src/lib/auth/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { authService } from './api/authService';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await authService.getMe();
        setUser(data.user);
      } catch (error) {
        // User not authenticated
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
    window.location.href = '/auth/login';
    return null;
  }
  
  return user;
};
```

### 8. Protected Route Wrapper

Create `src/components/layout/RequireAuth.tsx`:

```typescript
import { useRequireAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const user = useRequireAuth();
  const router = useRouter();

  if (!user) {
    // Redirect handled in hook
    return null;
  }

  return children;
};
```

### 9. Dashboard Layout Example

`src/app/(dashboard)/layout.tsx`:

```typescript
import { RequireAuth } from '@/components/layout/RequireAuth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RequireAuth>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar className="flex-shrink-0" />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </RequireAuth>
    </>
  );
};
```

### 10. Login Page Example

`src/app/auth/login/page.tsx`:

```typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/authService';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await authService.login(values);
      // Store access token
      localStorage.setItem('accessToken', data.accessToken);
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-center">Sign in to your dashboard</h2>
          <p className="text-center text-gray-600">
            Access your cloud hosting management console
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        <LoginForm onSubmit={handleSubmit} loading={loading} />
        
        <div className="text-center text-sm">
          <p>
            Don't have an account?{' '}
            <a href="/auth/register" className="font-medium text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Environment Setup

### 1. Backend Connection
Make sure your backend is running on `http://localhost:5000` (as configured in the backend setup).

### 2. CORS Configuration
Ensure your backend has CORS configured to allow requests from `http://localhost:3000`:
```javascript
// In backend server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 3. Cookie Settings
For refresh tokens to work properly in development:
- Backend should set cookies with `sameSite: 'lax'` (not 'strict') for localhost
- Or use `sameSite: 'none'` with `secure: false` in development only

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Access Application**: Visit `http://localhost:3000`
4. **Test Auth**: Try registering and logging in
5. **Access Dashboard**: After login, you should be redirected to `/dashboard`

## Key Features to Implement (Based on Planning Docs)

### Customer Dashboard
- [ ] Header navigation with user profile dropdown
- [ ] Sidebar navigation (Collapsible on mobile)
- [ ] Overview dashboard with key metrics
- [ ] VM management grid/list view
- [ ] Individual VM details with controls (start/stop/restart)
- [ ] Real-time monitoring charts (CPU, RAM, storage)
- [ ] Alerts center with filtering capabilities
- [ ] Billing and usage overview
- [ ] Support ticket submission form
- [ ] Remote desktop access launcher

### Administrator Dashboard
- [ ] Infrastructure overview (all VMs across customers)
- [ ] User management (create/edit/suspend users)
- [ ] Resource allocation and limits
- [ ] System monitoring and health checks
- [ ] Audit log viewer
- [ ] Backup management
- [ ] Security settings

### Technical Implementation
- [ ] React Query for data fetching and caching
- [ ] WebSocket connection for real-time updates (if implemented in backend)
- [ ] Optimistic UI updates for better UX
- [ ] Error boundaries and fallback UIs
- [ ] Loading skeletons and placeholders
- [ ] Form validation with Zod
- [ ] Role-based access control (RBAC) in UI
- [ ] Responsive design for mobile/tablet/desktop
- [ ] Dark/light theme support (using Tailwind dark mode)
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Unit and integration tests with Jest/Vitest
- [ ] End-to-end testing with Playwright/Cypress

## State Management Approach

### Server State (React Query)
- Fetching VM lists, monitoring data, user profile
- Automatic caching and background updates
- Pagination and infinite queries for large datasets
- Mutation functions for creating/updating/deleting resources

### Client State (Zustand/Jotai)
- UI state (sidebar collapse, modal open/close)
- Form state (temporary data before submission)
- Theme preferences
- Notification queue

## Authentication Flow

1. User visits `/auth/login`
2. Submits login form → calls `/api/auth/login` endpoint
3. Backend sets HTTP-only refresh token cookie and returns access token
4. Frontend stores access token in localStorage (or memory for higher security)
5. For subsequent requests, access token is sent in Authorization header
6. When access token expires (30min), frontend uses refresh token cookie to get new access token
7. On logout, frontend removes access token and calls `/api/auth/logout` to clear server-side session

## Security Considerations

- Access tokens stored in memory or localStorage with XSS protection
- Refresh tokens in HTTP-only, secure cookies (sameSite strict in production)
- All API calls made over HTTPS in production
- Input validation and sanitization on both frontend and backend
- Protection against CSRF (via SameSite cookies and token validation)
- Rate limiting on authentication endpoints
- Content Security Policy (CSP) headers
- Regular dependency security audits

## Styling and Design System

### Color Scheme (adjust to your brand)
- Primary: Blue shades (#3b82f6, #2563eb, etc.)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)
- Info: Sky blue (#06b6d4)

### Typography
- Font Family: Inter, system-ui
- Font Weights: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold), 800 (extra-bold)
- Responsive text sizes using clamp() or Tailwind's responsive prefixes

### Spacing
- Use Tailwind's default spacing scale (0.5rem increments)
- Consistent use of spacing utilities (p-, m-, space-, gap-)

### Border Radius
- Consistent use of `--radius` variable (20px as per design)
- Apply to cards, modals, buttons, inputs

### Shadows and Elevation
- Use Tailwind's shadow utilities consistently
- Consider elevation system for depth (shadow-md, shadow-lg, etc.)

## Deployment Considerations

### Build Optimization
- Enable Next.js analytics for performance insights
- Use next/image for optimized image loading
- Implement proper caching headers
- Consider CDN for static assets

### Environment Variables
- Production: Set NEXT_PUBLIC_API_URL to your production backend
- Consider using Vercel env vars or similar for secrets

### Monitoring
- Add error tracking (Sentry, LogRocket)
- Performance monitoring (Web Vitals)
- Usage analytics (Plausible, Umami)

## Testing Strategy

### Unit Tests
- Test individual components with Jest/Vitest and React Testing Library
- Test custom hooks
- Test utility functions
- Test API service layer

### Integration Tests
- Test component interactions
- Test form submissions
- Test authentication flow
- Test data fetching and state updates

### E2E Tests
- Test critical user journeys (login → view VMs → start VM → logout)
- Test responsive behavior across devices
- Test error states and edge cases

## Next Steps After Setup

1. **Implement Authentication Pages**: Login, register, password reset
2. **Create Dashboard Layout**: Header, sidebar, main content area
3. **Build VM Management**: List view, individual VM view, controls
4. **Implement Monitoring Dashboard**: Charts and metrics display
5. **Create Alerts System**: List, creation form, notification badge
6. **Add Remote Access**: Guacamole integration
7. **Implement User Profile**: Settings, password change, etc.
8. **Add Billing and Usage**: If implemented in backend
9. **Create Admin Dashboard**: If role-based access is implemented
10. **Add Testing**: Unit, integration, and E2E tests
11. **Performance Optimization**: Code splitting, lazy loading, etc.
12. **Deployment**: Configure for Vercel, Netlify, or traditional hosting

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check backend CORS configuration
2. **Authentication Loop**: Check token storage and refresh logic
3. **Cookie Not Sent**: Verify cookie settings (SameSite, Secure)
4. **State Not Updating**: Check React Query cache invalidation
5. **Styling Issues**: Verify Tailwind configuration and class names

### Debugging Tips
- Use React DevTools to inspect component state
- Use Network tab to inspect API requests/responses
- Check localStorage and Application → Cookies for token storage
- Verify Next.js middleware if using authentication middleware
- Check console for hydration errors in Next.js 13+

## Resources

- Next.js Documentation: https://nextjs.org/docs
- React Query: https://tanstack.com/query/v4
- Tailwind CSS: https://tailwindcss.com
- Headless UI: https://headlessui.com
- Heroicons: https://heroicons.com
- Zod: https://zod.dev
- React Hook Form: https://react-hook-form.com
- Chart.js: https://www.chartjs.org
- Recharts: https://recharts.org
- date-fns: https://date-fns.org
- Zustand: https://zustand-demo.pmnd.rs
- Jotai: https://jotai.org

With this frontend setup guide and the backend authentication system already created, you have a complete foundation for building the cloud hosting platform. The frontend will connect to the authentication endpoints I built in the backend, allowing users to log in with JWT tokens (30-minute access tokens as requested) and access the protected dashboard features.

Would you like me to help you implement any specific frontend component next, such as the login page, dashboard layout, or VM management interface?