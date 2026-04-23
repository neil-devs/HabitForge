-- Migration: Add Google Auth support
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN auth_provider VARCHAR(20) DEFAULT 'local';
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
