# Occasion Craft

A production-ready AI-assisted occasion template marketplace for creating beautiful celebration pages with ease.

## Features

### Customer Features
- Browse and search template catalog
- Filter by type (simple/complex) and category
- Live preview with real-time updates
- Dynamic form generation from JSON config
- AI-powered content suggestions
- Secure payment processing with Razorpay
- Instant shareable page generation
- Request system for complex templates
- WhatsApp integration for custom support

### Admin Features
- Complete template management (CRUD)
- JSON-based template configuration
- Request management dashboard
- Status tracking for complex templates
- Direct customer communication
- Payment and page tracking

### Template Types

**Simple Templates (Automated)**
- User fills dynamic form
- Real-time preview
- Pay and get instant shareable page
- No manual intervention needed

**Complex Templates (Manual)**
- User views preview
- Requests customization
- Admin contacts user
- Custom quote and timeline
- Manual delivery

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: Supabase PostgreSQL with RLS
- **Payment**: Razorpay
- **Deployment**: Vercel/Netlify

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Supabase account (already configured)
- Razorpay account (for payments)

### 2. Environment Setup

Your `.env` file needs:

```env
VITE_SUPABASE_URL=https://hthojqbeqxebtamwcgeq.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Setup

The database schema is already created with:
- 5 tables with proper relationships
- Row Level Security policies
- Indexes for performance
- Automated triggers

### 5. Seed Sample Data

See `SETUP.md` for SQL scripts to add sample templates.

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 7. Build for Production

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # Main layout
│   │   ├── DynamicForm.tsx         # JSON form generator
│   │   ├── TemplatePreview.tsx     # Template renderer
│   │   ├── RequestTemplateForm.tsx # Complex template requests
│   │   └── templates/
│   │       ├── BirthdayTemplate.tsx
│   │       └── WeddingTemplate.tsx
│   ├── pages/
│   │   ├── Home.tsx                # Landing page
│   │   ├── TemplateList.tsx        # Template catalog
│   │   ├── TemplateDetail.tsx      # Template customization
│   │   ├── Checkout.tsx            # Payment page
│   │   ├── ViewPage.tsx            # Shareable pages
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminTemplates.tsx
│   │       └── AdminRequests.tsx
│   ├── lib/
│   │   └── supabase.ts             # Supabase client
│   ├── types/
│   │   └── database.ts             # TypeScript types
│   └── utils/
│       └── slug.ts                 # URL slug generation
├── supabase/
│   └── functions/
│       ├── create-order/           # Payment order creation
│       └── verify-payment/         # Payment verification
├── SETUP.md                        # Setup instructions
├── ARCHITECTURE.md                 # System architecture
└── sample-configs.json             # Template config examples
```

## Routes

### Public Routes
- `/` - Home page
- `/templates` - Template catalog
- `/templates/:id` - Template details
- `/checkout/:id` - Payment page
- `/view/:slug` - Shareable pages

### Admin Routes
- `/admin` - Dashboard
- `/admin/templates` - Template management
- `/admin/requests` - Request management

## Database Schema

### templates
Stores template metadata, configuration, and pricing.

### user_pages
Generated pages after successful payment with unique URLs.

### template_requests
Customer requests for complex templates.

### payments
Payment transaction records linked to Razorpay.

### admin_users
Admin authentication and authorization.

## Payment Flow

1. User customizes template
2. Clicks "Proceed to Payment"
3. System creates Razorpay order
4. User completes payment
5. System verifies signature
6. Generates unique shareable page
7. Redirects to shareable URL

## Adding New Templates

### 1. Create Template Component

```typescript
// src/components/templates/YourTemplate.tsx
interface YourTemplateProps {
  data: Record<string, unknown>;
}

export default function YourTemplate({ data }: YourTemplateProps) {
  const { field1, field2 } = data;
  return (
    <div className="min-h-screen p-8">
      {/* Your design */}
    </div>
  );
}
```

### 2. Register Component

```typescript
// src/components/TemplatePreview.tsx
import YourTemplate from './templates/YourTemplate';

const templateComponents = {
  BirthdayTemplate,
  WeddingTemplate,
  YourTemplate, // Add here
};
```

### 3. Add to Database

Use the admin panel or SQL:

```sql
INSERT INTO templates (
  name, description, type, category, price,
  component_name, config, demo_data
) VALUES (
  'Your Template',
  'Description',
  'simple',
  'category',
  299,
  'YourTemplate',
  '{"fields": [...]}',
  '{...}'
);
```

## Template Configuration

Templates use JSON configuration for dynamic forms. See `sample-configs.json` for examples.

### Example Configuration

```json
{
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Name",
      "placeholder": "Enter name",
      "required": true
    },
    {
      "id": "message",
      "type": "textarea",
      "label": "Message",
      "aiSuggestion": true,
      "required": true
    },
    {
      "id": "color",
      "type": "color",
      "label": "Theme Color",
      "defaultValue": "#3B82F6"
    }
  ]
}
```

### Supported Field Types

- `text` - Single-line text
- `textarea` - Multi-line text
- `email` - Email with validation
- `tel` - Phone number
- `date` - Date picker
- `select` - Dropdown
- `color` - Color picker
- `image` - Image URL with preview

## Security

- Row Level Security on all tables
- Payment signature verification
- Admin authentication required
- No API keys in client code
- Secure CORS configuration

## Deployment

### Frontend (Vercel/Netlify)

1. Connect repository
2. Set environment variables
3. Deploy

### Backend (Supabase)

Edge Functions are already deployed:
- `create-order`
- `verify-payment`

## Payment Setup

### Razorpay Integration

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get API keys from Dashboard
3. Add to environment variables:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```
4. Edge Functions use `RAZORPAY_KEY_SECRET` automatically

### Test Mode

Use Razorpay test keys for development:
- Test cards: 4111 1111 1111 1111
- Any future date and CVV

## Admin Access

To create an admin user:

```sql
-- After creating user via Supabase Auth
INSERT INTO admin_users (id, email, role)
VALUES ('user-uuid', 'admin@example.com', 'super_admin');
```

## Documentation

- `SETUP.md` - Detailed setup instructions
- `ARCHITECTURE.md` - System architecture and data flow
- `sample-configs.json` - Template configuration examples

## API Documentation

### Edge Functions

#### POST /functions/v1/create-order
Creates Razorpay order and payment record.

#### POST /functions/v1/verify-payment
Verifies payment and generates shareable page.

See `ARCHITECTURE.md` for complete API documentation.

## Troubleshooting

### Build Errors
```bash
npm run typecheck
```

### Payment Issues
- Verify Razorpay credentials
- Check Edge Function logs
- Ensure signature verification

### Database Issues
- Check RLS policies
- Verify admin user setup
- Review migration logs

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## Support

For issues or questions:
- Check documentation files
- Review sample configurations
- Test with sample data
- Check browser console and network logs

## Roadmap

- [ ] Email notifications
- [ ] Template versioning
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] Custom domains
- [ ] Multi-language support
- [ ] Template marketplace
- [ ] Webhook management

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

Built with modern web technologies:
- React + TypeScript
- Supabase
- Tailwind CSS
- Razorpay
- Lucide Icons

---

**Need help?** Check the documentation files or create an issue.

**Ready to go?** Run `npm run dev` and start creating beautiful templates!
#   O c c a s i o n _ C r a f t  
 