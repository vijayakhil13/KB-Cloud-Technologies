# KB Cloud Technologiesing Platform Frontend

This is the frontend application for the cloud hosting platform, built with Next.js 13+, React 18, and TypeScript.

## Features

- Modern, responsive dashboard interface
- Authentication with JWT tokens (30-minute access tokens as requested)
- Virtual machine management
- Real-time monitoring and metrics
- Alerting system
- Remote desktop access via Apache Guacamole integration
- User profile and settings
- Role-based access control (customer/admin views)
- Mobile-responsive design

## Technology Stack

- **Framework**: Next.js 13+ with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (server state) + Zustand/Jotai (client state)
- **UI Components**: Headless UI + Heroicons
- **Data Visualization**: Chart.js/Recharts
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Authentication**: JWT token handling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running (see backend setup guide)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the frontend directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Make sure your backend is running on `http://localhost:5000` and has CORS configured to allow requests from `http://localhost:3000`.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 13+ app router
│   │   ├── (dashboard)/        # Protected routes (requires auth)
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar/header
│   │   │   ├── page.tsx        # Dashboard overview
│   │   │   ├── vms/            # VM management
│   │   │   │   ├── page.tsx    # VM list
│   │   │   │   └── [id]/       # Individual VM details
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
│   │   │   └── authService.ts  # Authentication service
│   │   ├── auth/               # Auth helpers
│   │   │   └── useAuth.ts      # Custom auth hook
│   │   ├── utils/              # General utilities
│   │   └── hooks/              # Custom React hooks
│   ├── styles/                 # CSS/Tailwind configuration
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Authentication Flow

1. User visits `/auth/login`
2. Submits login form → calls `/api/auth/login` endpoint via authService
3. Backend sets HTTP-only refresh token cookie and returns access token
4. Frontend stores access token in localStorage
5. For subsequent requests, access token is sent in Authorization header
6. When access token expires (30min), frontend uses refresh token cookie to get new access token
7. On logout, frontend removes access token and calls `/api/auth/logout`

## Key Components to Implement

Based on the Senior Frontend Agent's planning documents, here are the key components to build:

### Authentication
- Login form with email/password validation
- Registration form with validation
- Password reset flow
- Remember me functionality

### Dashboard Layout
- Responsive header with user menu
- Collapsible sidebar navigation
- Main content area with proper spacing

### Virtual Machine Management
- VM grid/list view with status indicators
- Individual VM details view
- VM controls (start/stop/restart/delete)
- VM creation/modal forms
- Resource utilization displays

### Monitoring & Metrics
- Real-time charts (CPU, memory, storage, network)
- Historical data views
- Customizable dashboard widgets
- Alert threshold configuration

### Alerting System
- Alert list with filtering and search
- Alert creation/modification forms
- Notification channels configuration
- Alert history and audit trail

### Remote Access
- Apache Guacamole integration
- Connection launcher/manager
- Session controls
- Access instructions

### User Profile & Settings
- Profile information management
- Password change functionality
- Two-factor authentication setup
- Notification preferences
- API key management (if applicable)

### Administration Features (for admin roles)
- User management (CRUD operations)
- Resource allocation and limits
- System monitoring and health checks
- Audit log viewer
- Backup management
- Security settings

## Development Guidelines

### Code Organization
- Follow the existing file structure
- Group related components in folders
- Use consistent naming conventions
- Write reusable, composable components
- Separate concerns (presentation vs logic)

### Styling
- Use Tailwind CSS utility classes
- Follow the established color scheme
- Use the `--radius` variable for consistent border radius
- Implement dark/light mode support
- Follow accessibility guidelines (WCAG 2.1 AA)

### State Management
- Use React Query for server state (data fetching, caching, updates)
- Use Zustand/Jotai for client state (UI state, form state, etc.)
- Implement optimistic updates where appropriate
- Handle loading and error states gracefully

### Forms
- Use React Hook Form for form state management
- Use Zod for form validation
- Implement proper error handling and user feedback
- Consider using form wizards for complex multi-step forms

### Performance
- Implement code splitting and lazy loading
- Use next/image for optimized image loading
- Implement caching strategies for API requests
- Minimize bundle size through code splitting
- Use React.memo for expensive components where appropriate

### Testing
- Write unit tests for components and hooks
- Write integration tests for key user flows
- Consider end-to-end testing with Playwright or Cypress
- Aim for high test coverage on critical paths

## Environment Setup

### Backend Connection
Make sure your backend is running and accessible at the URL specified in `NEXT_PUBLIC_API_URL`.

### CORS Configuration
Your backend should have CORS configured to allow requests from your frontend:
```javascript
// Example backend CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Cookie Settings
For refresh tokens to work properly:
- In development: Consider using `sameSite: 'lax'` or `sameSite: 'none'` with appropriate secure settings
- In production: Use `sameSite: 'strict'` with `secure: true`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can also be deployed to:
- Netlify
- AWS Amplify
- Traditional Node.js hosting
- Docker containers

## Troubleshooting

### Common Issues
1. **Authentication not working**: Check token storage and API URL configuration
2. **CORS errors**: Verify backend CORS configuration
3. **Styling issues**: Check Tailwind configuration and class names
4. **State not updating**: Verify React Query cache invalidation
5. **Routing issues**: Check Next.js app router structure

### Debugging Tips
- Use React DevTools to inspect component state
- Use Network tab to inspect API requests/responses
- Check localStorage and Application → Cookies for token storage
- Verify Next.js middleware if using authentication middleware
- Check console for hydration errors in Next.js 13+

## Next Steps

1. **Implement core authentication pages** (login, register)
2. **Build dashboard layout** with header and sidebar
3. **Create VM management components** (list, detail, controls)
4. **Implement monitoring dashboard** with charts and metrics
5. **Build alerting system** (list, creation form, notifications)
6. **Add remote access functionality** (Guacamole integration)
7. **Implement user profile and settings**
8. **Add role-based access control** for admin features
9. **Implement billing and usage tracking** (if applicable)
10. **Add comprehensive testing** (unit, integration, E2E)
11. **Optimize performance** (code splitting, lazy loading, etc.)
12. **Prepare for deployment** to your chosen platform

With this frontend application and the backend authentication system already created, you have a complete foundation for building the cloud hosting platform. The frontend will connect to the authentication endpoints in the backend, allowing users to log in with JWT tokens (30-minute access tokens as requested) and access the protected dashboard features.

Would you like me to help you implement any specific frontend component next?