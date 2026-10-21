# KB Cloud Technologiesing Platform Backend

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

- `POST /api/auth/forgot-password` - `{ email }`; always `200 { message: 'If an account exists, a reset link has been sent' }`
- `POST /api/auth/reset-password` - `{ token, password }`; `400 { error, code: 'INVALID_OR_EXPIRED_TOKEN' }` for bad/expired/used tokens

## Database migrations

On startup the server creates `schema_migrations` and applies every `migrations/*.sql` (in name order, once, each in a
transaction) before listening. Migrations are idempotent, so databases created from `database_schema.sql` also work.
If a migration fails the server exits and names the file. Manual fallback:

```bash
psql -U postgres -d cloud_hosting -f migrations/001_init.sql
psql -U postgres -d cloud_hosting -f migrations/002_users_role_default.sql
psql -U postgres -d cloud_hosting -f migrations/003_password_resets.sql
```

## Forgot password email (Gmail)

1. Google Account > Security > turn on **2-Step Verification** (required).
2. Google Account > Security > 2-Step Verification > **App passwords** > create one named "KB Cloud" and copy the 16-character password.
3. Set in `backend/.env` (never commit it):
   ```
   FRONTEND_URL=http://localhost:3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=you@gmail.com
   SMTP_PASS=<app password>
   MAIL_FROM="KB Cloud Technologies <you@gmail.com>"
   ```
4. Restart the backend, then:
   ```bash
   curl -X POST http://localhost:5000/api/auth/forgot-password -H "Content-Type: application/json" -d "{\"email\":\"you@gmail.com\"}"
   ```
   Open the emailed link (`/auth/reset-password?token=...`, valid 30 minutes, single use).

If `SMTP_USER`/`SMTP_PASS` are empty the API still returns 200 and, outside production, prints the reset link in the server log.
Reset links expire after 30 minutes; resetting revokes all sessions. Limits: forgot-password 5 per 15 min per IP+email.

Run the tests (no database or SMTP needed): `npm test`.

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