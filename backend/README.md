# Cloud Hosting Platform Backend

This is the backend service for the cloud hosting platform, providing authentication and API services.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your actual configuration
   - Pay special attention to:
     - Database credentials
     - JWT secrets (use strong, random values)
     - Node environment (development/production)

3. **Set Up Database**
   - Create a PostgreSQL database named `cloud_hosting`
   - Run the schema.sql script to create tables (found in the documentation)
   - Ensure the database user has appropriate permissions

4. **Run the Application**
   - Development: `npm run dev`
   - Production: `npm start`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user (returns access token and sets refresh token cookie)
- `POST /api/auth/refresh` - Refresh access token using refresh token cookie
- `POST /api/auth/logout` - Logout user (clears refresh token cookie)
- `GET /api/auth/me` - Get current user profile (requires access token)

## Security Features

- JWT-based authentication with 30-minute access tokens
- Refresh token rotation with 7-day expiry
- HTTP-only, secure cookies for refresh token storage
- Password hashing using bcrypt (12 salt rounds)
- Rate limiting to prevent brute force attacks
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- SQL injection prevention through parameterized queries

## Environment Variables

See `.env.example` for all required variables and their descriptions.

## Development

- The server automatically restarts on file changes when using `npm run dev`
- Logs are output to console in development
- Error handling returns appropriate HTTP status codes and messages