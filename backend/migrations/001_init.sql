-- Auth tables for the KB Cloud Technologies platform (subset of ../database_schema.sql).
-- Run with: psql -U postgres -d cloud_hosting -f migrations/001_init.sql
-- (Create the database first: CREATE DATABASE cloud_hosting;)
-- Uses gen_random_uuid() (built into PostgreSQL 13+; no extension needed).

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
  status        VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,          -- sha256 of the refresh token
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- Compatibility: databases created from the older database_schema.sql may lack some of these.
-- All statements are idempotent.
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number           VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified         BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts  INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until           TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at          TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at             TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS revoked_at    TIMESTAMPTZ;
