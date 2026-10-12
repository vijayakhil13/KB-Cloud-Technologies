# Cloud Hosting Platform Setup Guide

## What Has Been Completed

I've set up the backend authentication system with JWT-based authentication including 30-minute session tokens as requested.

### Files Created

1. **Backend Project Structure** (`backend/`)
   - `package.json` - Dependencies and scripts
   - `.env.example` - Environment variable template
   - `README.md` - Setup and usage instructions
   - `src/auth/` - Authentication service, middleware, and routes
   - `src/config/` - Database configuration
   - `src/middleware/` - Error handling
   - `src/utils/` - Logger
   - `server.js` - Main application entry point

2. **Database Schema** (`database_schema.sql`)
   - Complete schema for users, VMs, monitoring data, alerts, backups, and audit logs
   - Includes proper indexing and constraints
   - Ready for PostgreSQL with TimescaleDB extension

3. **Updated Progress Tracking**
   - Updated `.claude/agents.md` to show backend agent progress on authentication middleware

## What You Need to Do Next

### 1. Install Skills (If Not Already Done)
Follow the instructions in `.claude/SKILLS_INSTALLATION_GUIDE.md` to install the required skills for each agent.

### 2. Set Up the Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env
# Edit .env with your actual values

# Set up database:
# 1. Create PostgreSQL database named 'cloud_hosting'
# 2. Run the database_schema.sql to create tables
# 3. Ensure TimescaleDB extension is installed for monitoring metrics

# Start the development server
npm run dev
```

### 3. Test the Authentication System
Once the server is running, you can test the endpoints:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'

# Access protected route (replace YOUR_ACCESS_TOKEN)
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/auth/me
```

### 4. Continue with Agent Implementation
Based on the updated agents.md file, each agent now has specific "Performing" tasks to work on:

#### Senior Frontend Agent
- Setting up React/Next.js project with TypeScript
- Creating component library foundation
- Implementing routing structure
- Setting up state management solution
- Creating API service layer
- Building basic layout components
- Implementing authentication forms
- Creating dashboard layouts
- Developing data visualization components
- Implementing alert notification UI

#### Backend Agent
- Setting up database connection
- Creating data models and ORM configurations
- Implementing basic API endpoints
- Adding validation and sanitization
- Implementing error handling
- Setting up logging configuration
- Creating API documentation

#### Database Agent
- Setting up database connection
- Creating initial database schema
- Implementing data models
- Creating migration scripts
- Setting up indexing strategy
- Implementing data validation
- Creating backup procedures
- Setting up performance monitoring
- Implementing security measures (encryption)
- Creating database documentation

### 5. Environment Variables
Make sure to set these in your `.env` file:
- Database connection details
- JWT secrets (use strong, random values)
- Port configuration
- Security settings

## Next Steps After Backend is Working

Once the backend authentication is working, you should:
1. Have the frontend agent create the login/register pages that connect to these auth endpoints
2. Have the backend agent implement the VM management APIs
3. Have the database agent set up the initial schema and connection pooling
4. Continue implementing features according to the planning documents

## Important Security Notes

- The JWT access tokens expire in 30 minutes as requested
- Refresh tokens are stored in HTTP-only, secure cookies and expire in 7 days
- Always change the default admin password in production
- Use strong, random values for JWT secrets
- Never commit your `.env` file to version control
- In production, ensure HTTPS is used and set secure flags appropriately