# Service Layer Documentation

This directory contains service classes that handle all API communication for the application. Each service is responsible for a specific domain.

## Architecture

The service layer provides a clean abstraction over the HTTP API:
- Services use the centralized `apiClient` for HTTP requests
- All API endpoints are defined in `constants.ts`
- Services handle error logging and transformations
- Type-safe request/response handling

## Services

### AuthService
Handles user authentication and profile management.

**Usage:**
```typescript
import { AuthService } from '@/services';

// Register new user
const authResponse = await AuthService.register({
  email: 'user@example.com',
  password: 'secure-password',
  name: 'John Doe'
});

// Login
const loginResponse = await AuthService.login({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const profile = await AuthService.getCurrentUser();

// Update profile
await AuthService.updateProfile({ name: 'Jane Doe' });

// Logout
AuthService.logout();
```

### TemplateService
Manages template retrieval and creation (admin operations).

**Usage:**
```typescript
import { TemplateService } from '@/services';

// Get all templates
const templates = await TemplateService.getAllTemplates();

// Get template by ID
const template = await TemplateService.getTemplateById('template-123');

// Filter by type
const simpleTemplates = await TemplateService.getTemplatesByType('SIMPLE');

// Search templates
const results = await TemplateService.searchTemplates('birthday');

// Create new template (admin only)
const newTemplate = await TemplateService.createTemplate({
  name: 'My Template',
  description: 'Template description',
  // ... other fields
});
```

### PageService
Handles user page operations (viewing, creating, managing).

**Usage:**
```typescript
import { PageService } from '@/services';

// Get page by slug or ID
const page = await PageService.getPageBySlugOrId('my-page-slug');

// Increment view count
await PageService.incrementViewCount('page-id');

// Deactivate page
await PageService.deactivatePage('page-id');
```

### PaymentService
Manages payment processing and order tracking.

**Usage:**
```typescript
import { PaymentService } from '@/services';

// Create payment intent
const paymentIntent = await PaymentService.createPaymentIntent(
  'template-id',
  'user@example.com',
  4999 // amount in cents
);

// Complete payment with Stripe
// ... after Stripe confirmation ...
const verification = await PaymentService.verifyPayment(
  'order-id',
  'stripe-payment-intent-id'
);

// Get order details
const order = await PaymentService.getOrder('order-id');

// Get user orders
const orders = await PaymentService.getUserOrders('user@example.com');
```

### RequestService
Handles request creation and management (for collaborative invitations).

**Usage:**
```typescript
import { RequestService } from '@/services';

// Create request
const request = await RequestService.createRequest({
  template_id: 'template-123',
  requester_name: 'John',
  requester_email: 'john@example.com',
  recipient_name: 'Jane',
  recipient_email: 'jane@example.com',
  response_deadline: '2024-12-31'
});

// Get received requests
const received = await RequestService.getReceivedRequests('user@example.com');

// Accept request with response data
await RequestService.acceptRequest('request-id', {
  field1: 'value1',
  field2: 'value2'
});

// Reject request
await RequestService.rejectRequest('request-id');
```

## Error Handling

All services include try-catch blocks with error logging. Errors are thrown for component-level handling:

```typescript
try {
  const template = await TemplateService.getTemplateById('123');
} catch (error) {
  // Handle error in component
  console.error('Failed to load template:', error);
}
```

## API Client

The `apiClient` is a centralized HTTP client:

```typescript
import { apiClient } from '@/services';

// GET request
const data = await apiClient.get<DataType>('/endpoint');

// POST request with body
const result = await apiClient.post<ResultType>('/endpoint', { data });

// PUT request
const updated = await apiClient.put<UpdatedType>('/endpoint', { updates });

// DELETE request
await apiClient.delete('/endpoint');

// PATCH request
await apiClient.patch('/endpoint');
```

## Authentication Headers

The API client automatically includes the auth token from localStorage with all requests. Services don't need to handle this.

## Constants

All API endpoints are defined in `@/constants`:
- `API_ENDPOINTS.TEMPLATES` - GET all templates
- `API_ENDPOINTS.CREATE_ORDER` - POST create order
- `API_ENDPOINTS.GET_PAGE()` - Dynamic endpoint builder
- etc.

Refer to [constants.ts](../constants.ts) for the complete list.

## Adding New Services

1. Create a new file: `src/services/myService.ts`
2. Import `apiClient` and relevant types
3. Create service class with static methods
4. Export from `src/services/index.ts`
5. Add interface/types if needed

Example:
```typescript
import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants';

export class MyService {
  static async getItems(): Promise<Item[]> {
    return await apiClient.get<Item[]>(API_ENDPOINTS.MY_ITEMS);
  }
}
```

## Type Safety

All services are fully typed with TypeScript. Types are defined in:
- `src/types/database.ts` - Database models
- Individual service files - Request/response DTOs

## Testing

Services can be tested by mocking the `apiClient`:

```typescript
import { apiClient } from '@/services';
jest.mock('@/services/api');

// Mock implementation
(apiClient.get as jest.Mock).mockResolvedValue({ /* data */ });
```
