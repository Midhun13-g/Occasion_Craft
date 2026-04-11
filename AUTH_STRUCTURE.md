# Authentication Structure Guide

## Overview

The application now has **separate authentication** for:
1. **Users (Customers)** - Can register, login, purchase templates
2. **Admin (Single)** - Manages templates, requests, and system

---

## 🔵 User Authentication

### Registration & Login
- **URL**: `http://localhost:5173/auth`
- **Access**: Click "Login" button in navigation
- **Features**:
  - User registration with name, email, password
  - User login with email and password
  - Password visibility toggle
  - Form validation

### User Capabilities
- Browse and purchase templates
- View their purchased pages
- Manage their profile
- Cannot access admin panel

### User Database Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP
);
```

---

## 🔴 Admin Authentication

### Single Admin Account
- **URL**: `http://localhost:5173/admin/login`
- **Default Credentials**:
  - Email: `admin@templatemart.com`
  - Password: `Admin@123`

### Admin Login Page
- Dark themed (red/orange gradient)
- Shield icon
- Restricted access warning
- Role verification on login

### Admin Capabilities
- Full access to admin dashboard
- Manage templates (CRUD operations)
- Handle template requests
- View all user pages
- System configuration

### Admin Database Table
```sql
CREATE TABLE admin_users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'ADMIN') NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP
);
```

---

## 🔐 Security Implementation

### Password Hashing
- BCrypt with salt
- Minimum 6 characters (increase for production)
- Passwords never stored in plain text

### JWT Tokens
- 24-hour expiration
- Contains: email, userId, role
- Automatically included in API requests
- Stored in localStorage as `auth_token`

### Role-Based Access
- **USER**: Can access templates, checkout, user pages
- **ADMIN/SUPER_ADMIN**: Full system access

### Authorization Checks
```java
// In PaymentService
String authenticatedEmail = getAuthenticatedUserEmail();
if (!payment.getUserEmail().equals(authenticatedEmail)) {
    throw new RuntimeException("Unauthorized");
}
```

---

## 🚀 Getting Started

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

**Admin user is automatically created on first startup!**

Console output:
```
Default admin user created: admin@templatemart.com
Default admin password: Admin@123
IMPORTANT: Change the admin password after first login!
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access Points

**User Registration/Login:**
- Navigate to `http://localhost:5173`
- Click "Login" button
- Register new account or login

**Admin Login:**
- Navigate to `http://localhost:5173/admin/login`
- Use default credentials
- Change password after first login

---

## 📋 Configuration

### Change Admin Credentials

**Option 1: Environment Variables**
```bash
export ADMIN_EMAIL=your-admin@email.com
export ADMIN_PASSWORD=YourSecurePassword
```

**Option 2: application.properties**
```properties
admin.email=your-admin@email.com
admin.default.password=YourSecurePassword
```

### Production Settings
```properties
# Use strong password
admin.default.password=${ADMIN_PASSWORD}

# Use environment variable
admin.email=${ADMIN_EMAIL:admin@templatemart.com}

# Secure JWT secret (256+ bits)
jwt.secret=${JWT_SECRET}

# Set JPA to validate mode
spring.jpa.hibernate.ddl-auto=validate
```

---

## 🔄 Authentication Flow

### User Flow
```
1. User visits /auth
2. Registers with name, email, password
3. Backend creates User entity with role "USER"
4. JWT token generated with USER role
5. User redirected to /templates
6. Can purchase templates (requires authentication)
```

### Admin Flow
```
1. Admin visits /admin/login
2. Enters admin credentials
3. Backend checks AdminUser table
4. Verifies role is ADMIN or SUPER_ADMIN
5. JWT token generated with ADMIN role
6. Admin redirected to /admin dashboard
7. Full system access granted
```

---

## 🛡️ API Endpoints

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User/Admin login
- `GET /api/templates` - Browse templates
- `GET /api/pages/{slug}` - View public pages

### Protected Endpoints (Requires Authentication)
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify-payment` - Verify payment
- `GET /api/pages/user/{email}` - Get user's pages

### Admin Only Endpoints
- `POST /api/templates` - Create template
- `PUT /api/templates/{id}` - Update template
- `DELETE /api/templates/{id}` - Delete template
- `GET /api/admin/**` - All admin routes

---

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Admin Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@templatemart.com",
    "password": "Admin@123"
  }'
```

---

## 🎨 UI Differences

### User Auth Page (`/auth`)
- Blue/purple gradient
- Sparkles icon
- Light theme
- Registration option
- Social login buttons (UI only)
- Link to admin login

### Admin Login Page (`/admin/login`)
- Dark slate/red theme
- Shield icon
- Restricted access warning
- No registration option
- Security notice
- Back to home link

---

## 📊 Navigation Behavior

### Unauthenticated User
- Sees: Home, Templates, Login button

### Authenticated User (USER role)
- Sees: Home, Templates, User email, Logout
- Cannot see: Admin link

### Authenticated Admin (ADMIN role)
- Sees: Home, Templates, Admin, User email, Logout
- Full access to admin panel

---

## ⚠️ Important Security Notes

1. **Change default admin password immediately**
2. **Never commit credentials to git**
3. **Use environment variables in production**
4. **Enable HTTPS in production**
5. **Implement rate limiting for login attempts**
6. **Add 2FA for admin account (future enhancement)**
7. **Regular security audits**
8. **Monitor failed login attempts**

---

## 🐛 Troubleshooting

### Admin user not created
- Check console logs on startup
- Verify database connection
- Check `admin_users` table exists

### Cannot login as admin
- Verify email matches configuration
- Check password is correct
- Ensure admin user exists in database

### User cannot register
- Check if email already exists
- Verify database connection
- Check validation errors in console

### Token expired
- Tokens expire after 24 hours
- User must login again
- Implement refresh token (future enhancement)

---

## 📚 Related Files

**Backend:**
- `User.java` - User entity
- `AdminUser.java` - Admin entity
- `AuthService.java` - Authentication logic
- `AdminInitializer.java` - Auto-creates admin
- `SecurityConfig.java` - Security configuration

**Frontend:**
- `AuthPage.tsx` - User login/register
- `AdminLoginPage.tsx` - Admin login
- `AuthContext.tsx` - Auth state management
- `Layout.tsx` - Navigation with role-based display
