# Analytics Troubleshooting Guide

## Quick Fix Steps

### 1. Restart Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Check Backend is Running
Open browser: `http://localhost:8080/api/analytics`

**Expected Response (if not logged in):**
```json
{
  "error": "Unauthorized"
}
```

This is GOOD - it means the endpoint exists!

### 3. Login as Admin

**Option A: Use existing admin account**
- Go to: `http://localhost:5173/admin/login`
- Login with your admin credentials

**Option B: Check database for admin**
```sql
SELECT * FROM admin_users;
```

If no admin exists, create one:
```sql
-- First, create a user in the users table (if using auth)
-- Then add to admin_users
INSERT INTO admin_users (id, email, role, created_at)
VALUES (UUID(), 'admin@gmail.com', 'SUPER_ADMIN', NOW());
```

### 4. Test Analytics Endpoint with Auth

**Using Browser Console (F12):**
```javascript
// Get token from localStorage
const token = localStorage.getItem('auth_token');
console.log('Token:', token);

// Test API call
fetch('http://localhost:8080/api/analytics?days=30', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Analytics:', data))
.catch(err => console.error('Error:', err));
```

### 5. Check Browser Console

Open DevTools (F12) → Console tab

Look for:
```
[API] GET http://localhost:8080/api/analytics?days=30
[API] Response status: 200
[API] Response data: {...}
```

## Common Issues

### Issue 1: "Failed to load analytics data"

**Cause**: Backend not running or endpoint not accessible

**Fix**:
1. Check backend is running: `http://localhost:8080`
2. Check analytics endpoint: `http://localhost:8080/api/analytics`
3. Restart backend if needed

### Issue 2: "Unauthorized" or 401 Error

**Cause**: Not logged in as admin or token expired

**Fix**:
1. Go to `/admin/login`
2. Login with admin credentials
3. Check token exists: `localStorage.getItem('auth_token')`
4. If no token, login again

### Issue 3: "403 Forbidden"

**Cause**: User is not an admin

**Fix**:
1. Check user role in database:
```sql
SELECT u.email, au.role 
FROM users u 
LEFT JOIN admin_users au ON u.id = au.id 
WHERE u.email = 'your@email.com';
```

2. Add user to admin_users table if missing

### Issue 4: Empty Data (All zeros)

**Cause**: No payments in database

**Fix**:
1. Check if payments exist:
```sql
SELECT COUNT(*) FROM payments WHERE status = 'SUCCESSFUL';
```

2. If no payments, the analytics will show zeros (this is correct)

3. Create test payment data:
```sql
-- Insert test payment (adjust IDs as needed)
INSERT INTO payments (
  id, razorpay_order_id, template_id, amount, 
  currency, status, user_email, user_name, created_at
) VALUES (
  UUID(), 
  'order_test_123', 
  'your-template-id', 
  500, 
  'INR', 
  'SUCCESSFUL', 
  'test@example.com', 
  'Test User', 
  NOW()
);
```

### Issue 5: CORS Error

**Cause**: Frontend and backend on different origins

**Fix**:
Check `application.properties`:
```properties
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

Restart backend after changes.

## Verification Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Admin user exists in database
- [ ] Logged in as admin
- [ ] Token in localStorage
- [ ] Analytics endpoint accessible
- [ ] Browser console shows no errors
- [ ] Network tab shows 200 response

## Test Data

### Create Sample Templates
```sql
INSERT INTO templates (
  id, name, description, type, category, price, 
  preview_url, preview_type, template_url, 
  is_active, created_at, updated_at
) VALUES 
(UUID(), 'Birthday Template', 'Beautiful birthday template', 
 'SIMPLE', 'birthday', 299, 
 'https://via.placeholder.com/400', 'IMAGE', 'https://example.com/template1',
 true, NOW(), NOW()),
(UUID(), 'Wedding Template', 'Elegant wedding template', 
 'SIMPLE', 'wedding', 499, 
 'https://via.placeholder.com/400', 'IMAGE', 'https://example.com/template2',
 true, NOW(), NOW());
```

### Create Sample Payments
```sql
-- Get a template ID first
SET @template_id = (SELECT id FROM templates LIMIT 1);

-- Insert payments
INSERT INTO payments (
  id, razorpay_order_id, razorpay_payment_id, 
  template_id, amount, currency, status, 
  user_email, user_name, created_at
) VALUES 
(UUID(), 'order_001', 'pay_001', @template_id, 299, 'INR', 'SUCCESSFUL', 'user1@test.com', 'User 1', NOW()),
(UUID(), 'order_002', 'pay_002', @template_id, 299, 'INR', 'SUCCESSFUL', 'user2@test.com', 'User 2', NOW() - INTERVAL 1 DAY),
(UUID(), 'order_003', 'pay_003', @template_id, 499, 'INR', 'SUCCESSFUL', 'user3@test.com', 'User 3', NOW() - INTERVAL 2 DAY);
```

### Create Sample User Pages
```sql
INSERT INTO user_pages (
  id, template_id, unique_slug, user_name, user_email,
  user_data, is_active, view_count, created_at
) VALUES 
(UUID(), @template_id, 'birthday-john-2026', 'John Doe', 'john@test.com',
 '{}', true, 10, NOW()),
(UUID(), @template_id, 'wedding-jane-2026', 'Jane Smith', 'jane@test.com',
 '{}', true, 25, NOW());
```

## Expected Analytics Response

```json
{
  "total_templates": 2,
  "active_templates": 2,
  "total_revenue": 1097,
  "total_orders": 3,
  "total_pages": 2,
  "total_views": 20,
  "conversion_rate": 15.0,
  "top_templates": [
    {
      "id": "uuid",
      "name": "Birthday Template",
      "category": "birthday",
      "orders": 3,
      "revenue": 1097,
      "views": 30
    }
  ],
  "category_stats": [
    {
      "category": "birthday",
      "count": 1,
      "revenue": 1097,
      "orders": 3
    }
  ],
  "recent_activity": [
    {
      "date": "2026-01-09",
      "orders": 1,
      "revenue": 299
    },
    {
      "date": "2026-01-08",
      "orders": 1,
      "revenue": 299
    },
    {
      "date": "2026-01-07",
      "orders": 1,
      "revenue": 499
    }
  ]
}
```

## Debug Mode

Add this to AdminAnalytics component temporarily:

```typescript
const fetchAnalytics = async () => {
  setLoading(true);
  setError('');
  try {
    console.log('Fetching analytics for', timeRange, 'days');
    console.log('Token:', localStorage.getItem('auth_token'));
    
    const data = await analyticsService.getAnalytics(parseInt(timeRange));
    
    console.log('Analytics data received:', data);
    setAnalytics(data);
  } catch (error: any) {
    console.error('Analytics error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    setError(`Failed to load analytics: ${error.message}`);
  }
  setLoading(false);
};
```

## Contact Support

If issues persist:
1. Check backend logs in console
2. Check browser console for errors
3. Verify database has data
4. Share error messages for help

---

**Quick Start**: Restart backend → Login as admin → Navigate to `/admin/analytics`
