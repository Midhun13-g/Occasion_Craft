# Security Implementation Guide

## ✅ Completed Security Fixes

### Backend Security

1. **Spring Security Integration**
   - Added `spring-boot-starter-security` dependency
   - Created `SecurityConfig.java` with endpoint protection
   - Implemented JWT-based authentication

2. **JWT Token Authentication**
   - Added JWT dependencies (jjwt 0.12.3)
   - Created `JwtUtil.java` for token generation/validation
   - Created `JwtAuthenticationFilter.java` for request filtering
   - Tokens expire after 24 hours (configurable)

3. **Password Security**
   - Added password field to `AdminUser` entity
   - Implemented BCrypt password hashing
   - Passwords never stored in plain text

4. **Authentication Endpoints**
   - `POST /api/auth/login` - User login
   - `POST /api/auth/register` - User registration
   - Returns JWT token and user info

5. **Protected Endpoints**
   - `/api/payment/**` - Requires authentication
   - `/api/admin/**` - Requires ADMIN role
   - Public: `/api/auth/**`, `/api/templates/**`, `/api/pages/**`

6. **Database Security**
   - JPA ddl-auto configurable via environment variable
   - Use `validate` in production (set `JPA_DDL_AUTO=validate`)
   - Use Liquibase for schema migrations

### Frontend Security

1. **Real Authentication**
   - Replaced mock authentication with real API calls
   - `AuthPage.tsx` calls backend `/api/auth/login` and `/api/auth/register`
   - `AuthContext.tsx` uses `AuthService` for authentication

2. **JWT Token Management**
   - Tokens stored in localStorage as `auth_token`
   - Automatically attached to all API requests via `Authorization` header
   - Token format: `Bearer <token>`

3. **API Client Security**
   - Updated `api.ts` to include JWT token in all requests
   - Proper error handling for 401 Unauthorized responses

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
mvn clean install
```

### 2. Configure Environment Variables

Create `.env` file in backend directory:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=templatemart
DB_USER=root
DB_PASSWORD=your_password

# JPA (use 'validate' in production)
JPA_DDL_AUTO=update

# JWT
JWT_SECRET=your-secure-random-string-min-256-bits
JWT_EXPIRATION=86400000

# Razorpay
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Generate Secure JWT Secret

```bash
# Linux/Mac
openssl rand -base64 64

# Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 4. Database Migration

For production, change to `validate` mode and use Liquibase:

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.liquibase.enabled=true
```

### 5. Create Admin User

After first run, insert admin user with hashed password:

```sql
-- Password will be hashed by the application during registration
-- Use the /api/auth/register endpoint to create first admin
```

## 🔒 Security Best Practices

### Production Checklist

- [ ] Set `JPA_DDL_AUTO=validate`
- [ ] Generate strong JWT secret (min 256 bits)
- [ ] Use HTTPS only
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Implement refresh tokens
- [ ] Add account lockout after failed attempts
- [ ] Enable SQL injection protection (already enabled via JPA)
- [ ] Regular security audits
- [ ] Keep dependencies updated

### JWT Token Security

- Tokens expire after 24 hours
- Store in localStorage (consider httpOnly cookies for enhanced security)
- Validate on every request
- Include user role in token claims

### Password Requirements

- Minimum 6 characters (increase to 8+ for production)
- BCrypt hashing with salt
- No password in logs or error messages

## 🚀 Testing Authentication

### Register New User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access Protected Endpoint

```bash
curl -X POST http://localhost:8080/api/payment/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "templateId": 1,
    "amount": 299,
    "userEmail": "user@example.com",
    "userName": "John Doe"
  }'
```

## 📝 Remaining Improvements

1. **Implement Refresh Tokens**
   - Add refresh token endpoint
   - Store refresh tokens in database
   - Rotate tokens on refresh

2. **Add Rate Limiting**
   - Prevent brute force attacks
   - Use Spring Security rate limiting or Redis

3. **Email Verification**
   - Send verification email on registration
   - Verify email before allowing login

4. **Password Reset Flow**
   - Implement forgot password
   - Send reset token via email
   - Validate token and update password

5. **OAuth2 Integration**
   - Google OAuth2
   - Facebook OAuth2
   - Use Spring Security OAuth2

6. **Audit Logging**
   - Log authentication attempts
   - Track user actions
   - Monitor suspicious activity

## 🐛 Troubleshooting

### 401 Unauthorized

- Check if token is included in Authorization header
- Verify token hasn't expired
- Ensure token format is `Bearer <token>`

### 403 Forbidden

- User doesn't have required role
- Check endpoint requires ADMIN role

### Token Validation Failed

- JWT secret mismatch between environments
- Token expired
- Token tampered with

## 📚 References

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/)
- [OWASP Security Guidelines](https://owasp.org/)
