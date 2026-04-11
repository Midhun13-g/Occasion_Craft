# Authentication Quick Start Guide

## Accessing Login/Signup Page

### Option 1: Direct URL
Navigate to: `http://localhost:5173/auth`

### Option 2: Navigation Menu
1. Start the frontend: `npm run dev`
2. Click the **"Login"** button in the top-right navigation bar
3. Toggle between Login and Signup modes

## Features Available

### Login Page
- Email and password authentication
- Password visibility toggle
- Form validation
- "Forgot password?" link (placeholder)
- Social login buttons (Google/Facebook - UI only)

### Signup Page
- Full name, email, and password registration
- Password confirmation
- Email format validation
- Minimum password length (6 characters)

## Navigation Flow

```
Home (/) 
  └─> Click "Login" button
      └─> Auth Page (/auth)
          ├─> Login → Templates (/templates)
          └─> Signup → Templates (/templates)
```

## User Interface

### Authenticated State
When logged in, the navigation shows:
- User email
- Logout button

### Unauthenticated State
When not logged in, the navigation shows:
- Login button

## Testing Authentication

### 1. Register New User
```
URL: http://localhost:5173/auth
- Click "Sign up"
- Enter name, email, password
- Click "Create Account"
```

### 2. Login Existing User
```
URL: http://localhost:5173/auth
- Enter email and password
- Click "Sign In"
```

### 3. Logout
```
- Click user email in navigation
- Click "Logout" button
```

## Backend Requirements

Ensure backend is running:
```bash
cd backend
mvn spring-boot:run
```

Backend should be available at: `http://localhost:8080/api`

## API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- JWT token stored in localStorage as `auth_token`

## Troubleshooting

### "Login button not visible"
- Clear browser cache
- Restart frontend dev server
- Check AuthProvider is wrapping App in main.tsx

### "Cannot access /auth"
- Verify route exists in App.tsx
- Check browser console for errors
- Ensure React Router is properly configured

### "Authentication fails"
- Check backend is running on port 8080
- Verify database connection
- Check browser network tab for API errors
- Ensure CORS is configured correctly

## Security Notes

- Passwords are hashed with BCrypt on backend
- JWT tokens expire after 24 hours
- Tokens automatically included in all API requests
- Protected routes require authentication
