-- Add name column to admin_users table
ALTER TABLE admin_users ADD COLUMN name VARCHAR(255) AFTER email;

-- Disable safe mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Update existing admin users with default name
UPDATE admin_users SET name = 'Admin' WHERE name IS NULL OR name = '';

-- Re-enable safe mode
SET SQL_SAFE_UPDATES = 1;

-- Or update specific admin by email (safe mode friendly):
-- UPDATE admin_users SET name = 'Super Admin' WHERE email = 'admin@gmail.com';
