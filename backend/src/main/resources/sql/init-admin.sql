-- Admin User Initialization Script
-- Run this after the application creates the tables

-- Default Admin Credentials:
-- Email: admin@templatemart.com
-- Password: Admin@123

-- The application will automatically create this admin user on first startup
-- using the AdminInitializer component

-- To manually create admin user (if needed):
-- Note: Password is BCrypt hashed. Use the application to hash passwords.

-- Example: Create admin manually (password must be pre-hashed)
-- INSERT INTO admin_users (id, email, password, role, enabled, created_at)
-- VALUES (
--   UUID(),
--   'admin@templatemart.com',
--   '$2a$10$YourBCryptHashedPasswordHere',
--   'SUPER_ADMIN',
--   true,
--   NOW()
-- );

-- To change admin email, update application.properties:
-- admin.email=your-admin@email.com
-- admin.default.password=YourSecurePassword

-- IMPORTANT SECURITY NOTES:
-- 1. Change the default password immediately after first login
-- 2. Use a strong password (min 12 characters, mixed case, numbers, symbols)
-- 3. Never commit real passwords to version control
-- 4. Use environment variables for production credentials
-- 5. Enable 2FA if implementing additional security

-- Check if admin exists:
SELECT * FROM admin_users WHERE email = 'admin@templatemart.com';

-- Verify admin role:
SELECT id, email, role, enabled, created_at 
FROM admin_users 
WHERE role IN ('SUPER_ADMIN', 'ADMIN');
