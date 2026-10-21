<<<<<<< HEAD
-- Auth tables for the CloudHost platform (subset of ../database_schema.sql).
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
=======
-- Initial schema for the CloudHost platform.
-- Run with: psql -U postgres -d cloud_hosting -f migrations/001_init.sql
-- (Create the database first if it doesn't exist: CREATE DATABASE cloud_hosting;)

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(50)  NOT NULL,
  last_name     VARCHAR(50)  NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'customer',  -- customer | admin
  status        VARCHAR(20)  NOT NULL DEFAULT 'active',    -- active | suspended
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
>>>>>>> f0b1ebd36e96d97161eb04c8748b2ad53a6d8e57
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
<<<<<<< HEAD
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
=======
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
>>>>>>> f0b1ebd36e96d97161eb04c8748b2ad53a6d8e57
  token_hash VARCHAR(255) NOT NULL,          -- sha256 of the refresh token
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
