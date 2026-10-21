-- For databases created from the older database_schema.sql, where users.role had no default.
-- Safe to run more than once.
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'customer';
UPDATE users SET role = 'customer' WHERE role IS NULL;
