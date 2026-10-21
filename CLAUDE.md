# KB Cloud Technologies – cloud server hosting platform

Monorepo: `frontend/` (Next.js 13 + Tailwind, port 3000), `backend/` (Express + PostgreSQL, port 5000), `database_schema.sql` + `backend/migrations/` (PostgreSQL).

## Run locally
1. Install Node.js LTS and PostgreSQL 13+.
2. Database: create `cloud_hosting`, then `psql -U postgres -d cloud_hosting -f backend/migrations/001_init.sql`.
3. Backend: `cd backend && npm install`, copy `.env.example` → `.env` and set `DB_PASSWORD`, then `npm run dev` → http://localhost:5000/health.
4. Frontend: `cd frontend && npm install`, copy `.env.example` → `.env.local`, then `npm run dev` → http://localhost:3000.

## Conventions
- API JSON is camelCase; DB columns snake_case; user ids are UUID strings.
- Auth: 30-min JWT access token (Bearer) + 7-day rotating refresh token (httpOnly cookie).
- Client components need `'use client'`.

## Agents (`.claude/agents/`)
- `ui-ux-designer` – design specs, tokens, accessibility.
- `frontend-developer` – implements/fixes the Next.js app.
- `backend-engineer` – API, auth, security, tests.
- `database-engineer` – schema, migrations, local Postgres setup.
Old planning docs are kept in `.claude/legacy-agents/`.
