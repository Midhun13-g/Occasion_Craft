-- Remove unwanted columns from users table
ALTER TABLE users DROP COLUMN IF EXISTS phone;

-- Add name column to admin_users if not exists
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Update existing admin users with default name
UPDATE admin_users SET name = 'Admin' WHERE name IS NULL;
