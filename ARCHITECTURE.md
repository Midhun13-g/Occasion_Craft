# System Architecture

## Overview

This is a full-stack template marketplace with hybrid monetization, supporting both automated (simple) and manual (complex) template workflows.

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Supabase Edge Functions** (Deno runtime)
- **Supabase PostgreSQL** database
- **Razorpay** payment gateway

### Infrastructure
- **Supabase** for backend services
- **Vercel/Netlify** for frontend hosting

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │  Template  │  │  Dynamic   │  │   Live     │  │ Payment  │ │
│  │  Listing   │  │   Form     │  │  Preview   │  │ Checkout │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │  Shareable │  │   Request  │  │   Admin    │               │
│  │   Pages    │  │    Form    │  │   Panel    │               │
│  └────────────┘  └────────────┘  └────────────┘               │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API / Supabase Client
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (Supabase)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Edge Functions (Serverless)                  │  │
│  │                                                            │  │
│  │  ┌──────────────┐        ┌──────────────┐               │  │
│  │  │ create-order │        │verify-payment│               │  │
│  │  │              │        │              │               │  │
│  │  │ - Create     │        │ - Verify     │               │  │
│  │  │   Razorpay   │        │   signature  │               │  │
│  │  │   order      │        │ - Generate   │               │  │
│  │  │ - Store      │        │   page       │               │  │
│  │  │   payment    │        │ - Update     │               │  │
│  │  │              │        │   payment    │               │  │
│  │  └──────────────┘        └──────────────┘               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          PostgreSQL Database (with RLS)                   │  │
│  │                                                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │  templates  │  │ user_pages  │  │  payments   │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  │                                                            │  │
│  │  ┌─────────────┐  ┌─────────────┐                       │  │
│  │  │  template_  │  │   admin_    │                       │  │
│  │  │  requests   │  │   users     │                       │  │
│  │  └─────────────┘  └─────────────┘                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Razorpay API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    RAZORPAY (Payment Gateway)                    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Simple Template Flow (Automated)

```
1. User browses templates → /templates
2. User selects template → /templates/:id
3. User fills dynamic form (live preview updates)
4. User proceeds to checkout → /checkout/:id
5. User enters details and clicks pay
6. Frontend → create-order Edge Function
7. Edge Function → Razorpay API (create order)
8. Razorpay API → Edge Function (order details)
9. Edge Function → Database (store payment record)
10. Frontend receives order → Opens Razorpay modal
11. User completes payment
12. Razorpay → Frontend (payment success)
13. Frontend → verify-payment Edge Function
14. Edge Function verifies signature
15. Edge Function → Database (create user_page)
16. Edge Function → Database (update payment)
17. Frontend → /view/:slug (shareable page)
```

### Complex Template Flow (Manual)

```
1. User browses templates → /templates
2. User selects complex template → /templates/:id
3. User views preview (image/video/iframe)
4. User clicks "Request Template"
5. User fills request form
6. Frontend → Database (insert template_request)
7. Admin views requests → /admin/requests
8. Admin contacts customer (WhatsApp/Email)
9. Admin updates request status
10. Manual work and payment handling
```

## API Endpoints

### Edge Functions

#### POST /functions/v1/create-order
Creates a Razorpay order and stores payment record.

**Request:**
```json
{
  "template_id": "uuid",
  "amount": 299,
  "user_name": "John Doe",
  "user_email": "john@example.com"
}
```

**Response:**
```json
{
  "order": {
    "id": "order_xxx",
    "amount": 29900,
    "currency": "INR"
  }
}
```

#### POST /functions/v1/verify-payment
Verifies payment signature and creates shareable page.

**Request:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "user_data": {},
  "user_name": "John Doe",
  "user_email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "page": {
    "id": "uuid",
    "unique_slug": "timestamp-random"
  }
}
```

### Database Direct Access

Frontend uses Supabase client for direct database access with RLS:

- **templates**: Public read for active templates
- **user_pages**: Public read for active pages, write restricted
- **template_requests**: Public insert, admin read/update
- **payments**: System managed
- **admin_users**: Admin only

## Component Structure

```
src/
├── components/
│   ├── Layout.tsx                 # Main layout with nav/footer
│   ├── DynamicForm.tsx            # JSON-driven form generator
│   ├── TemplatePreview.tsx        # Template rendering engine
│   ├── RequestTemplateForm.tsx    # Complex template request form
│   └── templates/
│       ├── BirthdayTemplate.tsx   # Birthday template component
│       └── WeddingTemplate.tsx    # Wedding template component
├── pages/
│   ├── Home.tsx                   # Landing page
│   ├── TemplateList.tsx           # Template catalog
│   ├── TemplateDetail.tsx         # Template details & customization
│   ├── Checkout.tsx               # Payment page
│   ├── ViewPage.tsx               # Shareable page view
│   └── admin/
│       ├── AdminDashboard.tsx     # Admin overview
│       ├── AdminTemplates.tsx     # Template management
│       └── AdminRequests.tsx      # Request management
├── lib/
│   └── supabase.ts                # Supabase client
├── types/
│   └── database.ts                # TypeScript types
└── utils/
    └── slug.ts                    # URL slug generation
```

## Database Schema

### templates
- Stores template metadata and configuration
- Form config (JSON) defines dynamic form fields
- Demo data used for preview

### user_pages
- Generated after successful payment
- Contains user's customized data
- Unique slug for shareable URL
- View counter

### template_requests
- Stores requests for complex templates
- Admin can update status and notes
- Used for manual workflow

### payments
- Tracks all payment transactions
- Links to Razorpay order/payment IDs
- References generated page

### admin_users
- Admin authentication
- Role-based access control
- Links to Supabase auth.users

## Security

### Row Level Security (RLS)

All tables have RLS enabled with specific policies:

- **Public access**: Active templates, active pages
- **Authenticated access**: Admin operations
- **System access**: Payment operations

### Payment Security

- HMAC signature verification
- Server-side validation
- No client-side price manipulation
- Payment ID stored for audit trail

### Admin Security

- Authentication required
- Role-based access
- Admin table with authorized users only

## Scalability

### Frontend
- Static site generation ready
- CDN-friendly
- Image optimization recommended

### Backend
- Serverless Edge Functions auto-scale
- Database connection pooling
- Indexed queries for performance

### Database
- Indexes on frequently queried fields
- Efficient RLS policies
- View counter incremented separately

## Monitoring

### Frontend
- Browser console for errors
- Network tab for API calls

### Backend
- Supabase Edge Function logs
- Database logs
- Razorpay webhook logs

### Database
- Query performance monitoring
- Connection pool monitoring
- RLS policy performance

## Future Enhancements

### Potential Features
- Email notifications
- Template versioning
- A/B testing
- Analytics dashboard
- Template preview sharing
- Bulk operations
- Export functionality
- Custom domain support
- Multi-language support
- Template marketplace

### Technical Improvements
- GraphQL API
- Caching layer
- CDN integration
- Image optimization
- Progressive Web App
- Offline support
- Real-time collaboration
- Webhook management

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading routes
- Image lazy loading
- Minimize bundle size

### Backend
- Edge Function cold start optimization
- Database query optimization
- Connection reuse
- Caching strategies

### Database
- Query optimization
- Index tuning
- Materialized views
- Partitioning (if needed)
