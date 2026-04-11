# 🚀 START APPLICATION - Simple Guide

## Option 1: Automated Script (Recommended)

Run this in PowerShell:

```powershell
cd C:\Users\RajaI\Downloads\project-bolt-sb1-g4ex4ctc\craft1
.\start-backend.ps1
```

It will:
1. Check MySQL is running
2. Ask for your MySQL password
3. Create database automatically
4. Set environment variables
5. Start the application

---

## Option 2: Manual Steps

### Step 1: Start MySQL
```powershell
net start MySQL80
```

### Step 2: Create Database
```powershell
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS templatemart;
exit;
```

### Step 3: Update Password

Edit: `backend/src/main/resources/application.properties`

Line 21, change:
```properties
spring.datasource.password=${DB_PASSWORD:password}
```

To (replace with YOUR password):
```properties
spring.datasource.password=YourMySQLPassword
```

### Step 4: Start Backend
```powershell
cd backend
mvn spring-boot:run
```

---

## Option 3: Using Environment Variables

```powershell
# Set password
$env:DB_PASSWORD="YourMySQLPassword"

# Start application
cd backend
mvn spring-boot:run
```

---

## ✅ Success Indicators

You'll see:
```
Started TemplateMarktApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

Test it:
```powershell
curl http://localhost:8080/api/templates
```

---

## ❌ If It Fails

### Error: "Access denied"
**Fix**: Wrong MySQL password. Update in application.properties

### Error: "Unknown database"
**Fix**: Run `CREATE DATABASE templatemart;` in MySQL

### Error: "Communications link failure"
**Fix**: Start MySQL service: `net start MySQL80`

### Error: "Table doesn't exist"
**Fix**: Already handled! `ddl-auto=update` will create tables automatically

---

## 🎯 Quick Test Commands

After startup, test these endpoints:

```powershell
# Get all templates
curl http://localhost:8080/api/templates

# Health check
curl http://localhost:8080/api/actuator/health

# Create a test template
curl -X POST http://localhost:8080/api/templates `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test Template",
    "description": "Test",
    "type": "SIMPLE",
    "category": "test",
    "price": 99,
    "template_url": "https://example.com/template",
    "preview_url": "https://example.com/preview.jpg",
    "preview_type": "IMAGE",
    "features": "[]",
    "config": "{}",
    "demo_data": "{}",
    "is_active": true
  }'
```

---

## 📝 What I Changed

1. ✅ Set `ddl-auto=update` - Auto-creates tables
2. ✅ Added default values for Razorpay (test mode)
3. ✅ Added default values for Cloudinary (optional)
4. ✅ Fixed Hibernate dialect to `MySQLDialect`

---

## 🔥 Just Run This!

**Easiest way:**

```powershell
# 1. Update password in application.properties (line 21)
# 2. Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS templatemart"

# 3. Start
cd backend
mvn spring-boot:run
```

That's it! 🎉
