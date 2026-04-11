# Quick Database Connection Test

## Step 1: Verify MySQL is Running

```powershell
# Check if MySQL service is running
Get-Service -Name MySQL*

# Or check process
Get-Process -Name mysqld -ErrorAction SilentlyContinue
```

If not running:
```powershell
# Start MySQL service
net start MySQL80  # or MySQL57, check your version
```

---

## Step 2: Test MySQL Connection

```powershell
# Test connection with your password
mysql -u root -p
# Enter your password when prompted
```

If this fails, your password is wrong or MySQL isn't configured properly.

---

## Step 3: Create Database

Once connected to MySQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS templatemart;

-- Verify it was created
SHOW DATABASES;

-- Use the database
USE templatemart;

-- Check tables (should be empty initially)
SHOW TABLES;
```

---

## Step 4: Update Application Configuration

**Option A: Direct in application.properties (Quick Test)**

Edit: `backend/src/main/resources/application.properties`

Change this line:
```properties
spring.datasource.password=${DB_PASSWORD:password}
```

To your actual password:
```properties
spring.datasource.password=YourActualPassword123
```

**Option B: Use Environment Variables (Recommended)**

In PowerShell (before running the app):
```powershell
$env:DB_PASSWORD="YourActualPassword123"
$env:RAZORPAY_KEY_ID="test_key"
$env:RAZORPAY_KEY_SECRET="test_secret"
```

---

## Step 5: Temporarily Change DDL Auto

For initial setup, edit `application.properties`:

Change:
```properties
spring.jpa.hibernate.ddl-auto=validate
```

To:
```properties
spring.jpa.hibernate.ddl-auto=update
```

This will auto-create tables on first run.

---

## Step 6: Start Application

```powershell
cd backend
mvn spring-boot:run
```

---

## Step 7: Verify Tables Created

After successful startup, check MySQL:

```sql
USE templatemart;
SHOW TABLES;

-- You should see:
-- admin_users
-- payments
-- template_requests
-- templates
-- user_pages
```

---

## Step 8: Run Migration (Add template_url)

```sql
USE templatemart;

-- Check if template_url exists
DESCRIBE templates;

-- If component_name exists and template_url doesn't:
ALTER TABLE templates 
ADD COLUMN template_url TEXT NOT NULL DEFAULT 'https://example.com/template';

ALTER TABLE templates 
DROP COLUMN IF EXISTS component_name;

ALTER TABLE templates 
ALTER COLUMN template_url DROP DEFAULT;
```

---

## Step 9: Change Back to Validate

After tables are created, change back:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

---

## Common Errors & Solutions

### Error: "Access denied for user 'root'@'localhost'"
**Solution**: Wrong password. Update in application.properties or environment variable.

### Error: "Unknown database 'templatemart'"
**Solution**: Database doesn't exist. Run `CREATE DATABASE templatemart;`

### Error: "Communications link failure"
**Solution**: MySQL service not running. Start it with `net start MySQL80`

### Error: "Table 'templates' doesn't exist"
**Solution**: Set `spring.jpa.hibernate.ddl-auto=update` temporarily

---

## Quick Test Script

Save as `test-db.sql` and run: `mysql -u root -p < test-db.sql`

```sql
-- Test database connection and setup
CREATE DATABASE IF NOT EXISTS templatemart;
USE templatemart;

-- Show current tables
SHOW TABLES;

-- If you want to start fresh (CAUTION: Deletes all data)
-- DROP DATABASE templatemart;
-- CREATE DATABASE templatemart;
```

---

## Minimal Working Configuration

If nothing works, try this minimal config:

```properties
# Minimal application.properties for testing
server.port=8080
server.servlet.context-path=/api

spring.datasource.url=jdbc:mysql://localhost:3306/templatemart
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

razorpay.key-id=test_key
razorpay.key-secret=test_secret

app.cors.allowed-origins=http://localhost:5173
```

Replace `YOUR_PASSWORD_HERE` with your actual MySQL root password.
