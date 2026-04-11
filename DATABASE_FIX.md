# Database Configuration Fix

## Issues Found:
1. ❌ MySQL password incorrect
2. ❌ Wrong Hibernate dialect (MySQL8InnoDBDialect doesn't exist in Hibernate 6.x)

## ✅ Fixed:
1. ✅ Updated Hibernate dialect to `MySQLDialect`
2. ✅ Created `.env.example` file

---

## Quick Fix Steps:

### Option 1: Update MySQL Password in application.properties

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_ACTUAL_MYSQL_PASSWORD
```

### Option 2: Use Environment Variables (Recommended)

1. Create `.env` file in `backend/` directory:
```bash
DB_PASSWORD=your_actual_mysql_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

2. Or set environment variables in your IDE/terminal:
```bash
# Windows PowerShell
$env:DB_PASSWORD="your_password"
$env:RAZORPAY_KEY_ID="your_key"
$env:RAZORPAY_KEY_SECRET="your_secret"

# Windows CMD
set DB_PASSWORD=your_password
set RAZORPAY_KEY_ID=your_key
set RAZORPAY_KEY_SECRET=your_secret
```

---

## Create Database

If database doesn't exist, create it:

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS templatemart 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;
USE templatemart;
```

---

## Run Migration

After database is created, run the migration:

```sql
USE templatemart;

-- Add template_url column
ALTER TABLE templates 
ADD COLUMN template_url TEXT NOT NULL DEFAULT 'https://example.com/template';

-- Drop old column (if exists)
ALTER TABLE templates 
DROP COLUMN IF EXISTS component_name;

-- Remove default
ALTER TABLE templates 
ALTER COLUMN template_url DROP DEFAULT;
```

---

## Test Database Connection

```bash
# Test MySQL connection
mysql -u root -p -e "SELECT 1"

# Check if database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'templatemart'"
```

---

## Start Application

After fixing database:

```bash
cd backend
mvn spring-boot:run
```

Or in IDE, set environment variables:
- `DB_PASSWORD=your_password`
- `RAZORPAY_KEY_ID=your_key`
- `RAZORPAY_KEY_SECRET=your_secret`

---

## Verify Application Started

You should see:
```
Started TemplateMarktApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

Test endpoint:
```bash
curl http://localhost:8080/api/templates
```

---

## Common Issues

### Issue: Access Denied
**Solution**: Check MySQL password is correct

### Issue: Database doesn't exist
**Solution**: Create database using SQL above

### Issue: Table doesn't exist
**Solution**: Run migration script or set `spring.jpa.hibernate.ddl-auto=update` temporarily

### Issue: Razorpay keys missing
**Solution**: Set environment variables or add to application.properties
