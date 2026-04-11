# Template Marketplace - Setup Guide

A production-ready template marketplace with automated and manual workflows, built with React, Supabase, and Razorpay.

## Architecture Overview

### Frontend (React + TypeScript + Tailwind)
- Template browsing and filtering
- Dynamic form generation based on JSON config
- Live preview system
- Razorpay payment integration
- Shareable page rendering

### Backend (Supabase Edge Functions)
- `create-order`: Creates Razorpay orders and payment records
- `verify-payment`: Verifies payment and generates unique shareable pages

### Database (Supabase PostgreSQL)
- `templates`: Template catalog with pricing and configuration
- `user_pages`: Generated pages after payment
- `template_requests`: Requests for complex templates
- `payments`: Payment transaction tracking
- `admin_users`: Admin authentication

## Getting Started

### 1. Environment Variables

Your `.env` file already contains Supabase credentials. Add your Razorpay credentials:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

For Edge Functions, configure these secrets (automatically handled):
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### 2. Database Setup

The database schema has already been created with:
- All necessary tables
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for timestamp updates

### 3. Seed Sample Data

Run this SQL in your Supabase SQL Editor to add sample templates:

```sql
-- Insert sample templates
INSERT INTO templates (name, description, type, category, price, preview_url, preview_type, component_name, is_active, features, config, demo_data) VALUES
(
  'Birthday Celebration',
  'A beautiful birthday template with customizable colors, images, and messages. Perfect for sending birthday wishes!',
  'simple',
  'birthday',
  299,
  'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg',
  'image',
  'BirthdayTemplate',
  true,
  ARRAY['Customizable colors', 'Image upload', 'Personal message', 'Instant sharing'],
  '{
    "fields": [
      {
        "id": "name",
        "type": "text",
        "label": "Birthday Person Name",
        "placeholder": "Enter name",
        "required": true
      },
      {
        "id": "age",
        "type": "text",
        "label": "Age",
        "placeholder": "Enter age",
        "required": true
      },
      {
        "id": "message",
        "type": "textarea",
        "label": "Birthday Message",
        "placeholder": "Write your birthday wishes...",
        "required": true,
        "aiSuggestion": true
      },
      {
        "id": "primaryColor",
        "type": "color",
        "label": "Primary Color",
        "required": true,
        "defaultValue": "#FF6B9D"
      },
      {
        "id": "secondaryColor",
        "type": "color",
        "label": "Secondary Color",
        "required": true,
        "defaultValue": "#FFC93C"
      },
      {
        "id": "imageUrl",
        "type": "image",
        "label": "Background Image URL",
        "placeholder": "https://example.com/image.jpg",
        "required": false
      }
    ]
  }',
  '{
    "name": "John Doe",
    "age": "25",
    "message": "Wishing you a day filled with happiness and a year filled with joy!",
    "primaryColor": "#FF6B9D",
    "secondaryColor": "#FFC93C",
    "imageUrl": "https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg"
  }'
),
(
  'Wedding Invitation',
  'Elegant wedding invitation template with customizable details, date, venue, and personal message.',
  'simple',
  'wedding',
  499,
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg',
  'image',
  'WeddingTemplate',
  true,
  ARRAY['Elegant design', 'Date and venue', 'Custom message', 'Mobile responsive'],
  '{
    "fields": [
      {
        "id": "bride",
        "type": "text",
        "label": "Bride Name",
        "placeholder": "Enter bride name",
        "required": true
      },
      {
        "id": "groom",
        "type": "text",
        "label": "Groom Name",
        "placeholder": "Enter groom name",
        "required": true
      },
      {
        "id": "date",
        "type": "date",
        "label": "Wedding Date",
        "required": true
      },
      {
        "id": "venue",
        "type": "text",
        "label": "Venue",
        "placeholder": "Enter venue name",
        "required": true
      },
      {
        "id": "message",
        "type": "textarea",
        "label": "Invitation Message",
        "placeholder": "Write your invitation message...",
        "required": true,
        "aiSuggestion": true
      },
      {
        "id": "imageUrl",
        "type": "image",
        "label": "Cover Image URL",
        "placeholder": "https://example.com/image.jpg",
        "required": false
      }
    ]
  }',
  '{
    "bride": "Sarah",
    "groom": "Michael",
    "date": "2026-12-31",
    "venue": "Garden Palace Hotel",
    "message": "Join us as we celebrate our special day and the beginning of our journey together",
    "imageUrl": "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg"
  }'
),
(
  'Premium Business Portfolio',
  'A premium business portfolio template with advanced customization. Requires personal consultation.',
  'complex',
  'business',
  2999,
  'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
  'image',
  'BusinessTemplate',
  true,
  ARRAY['Advanced customization', 'Professional design', 'SEO optimized', 'Personal consultation'],
  '{"fields": []}',
  '{}'
);
```

### 4. Create Admin User (Optional)

To access admin features, create an admin user:

```sql
-- First, create a user through Supabase Auth UI or signup
-- Then add them to admin_users table (replace with actual user ID)
INSERT INTO admin_users (id, email, role)
VALUES ('your-user-uuid-here', 'admin@example.com', 'super_admin');
```

## Template Configuration Guide

### Simple Templates (Automated Flow)

Simple templates require a JSON configuration that defines the form fields:

```json
{
  "fields": [
    {
      "id": "fieldName",
      "type": "text|textarea|email|tel|date|select|image|color",
      "label": "Field Label",
      "placeholder": "Placeholder text",
      "required": true|false,
      "aiSuggestion": true|false,
      "options": [
        {"value": "val1", "label": "Option 1"}
      ],
      "defaultValue": "default",
      "validation": {
        "min": 0,
        "max": 100,
        "pattern": "regex",
        "message": "Error message"
      }
    }
  ]
}
```

### Creating New Template Components

1. Create a new component in `src/components/templates/`:

```typescript
interface YourTemplateProps {
  data: Record<string, unknown>;
}

export default function YourTemplate({ data }: YourTemplateProps) {
  const { field1, field2 } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-8">
      {/* Your template design */}
    </div>
  );
}
```

2. Register it in `src/components/TemplatePreview.tsx`:

```typescript
import YourTemplate from './templates/YourTemplate';

const templateComponents = {
  BirthdayTemplate,
  WeddingTemplate,
  YourTemplate, // Add here
};
```

### Complex Templates (Manual Flow)

Complex templates don't require form configuration. They show:
- Preview (image/video/iframe)
- Request form
- WhatsApp contact option

## Payment Integration

### Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com)
2. Get your Test/Live credentials
3. Add to `.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```
4. Edge Functions will use `RAZORPAY_KEY_SECRET` automatically

### Payment Flow

1. User fills form and clicks "Proceed to Payment"
2. Frontend calls `/create-order` Edge Function
3. Razorpay checkout modal opens
4. On success, frontend calls `/verify-payment`
5. Backend verifies signature and creates shareable page
6. User redirected to `/view/{unique-slug}`

## Features

### For Customers

- Browse templates by type and category
- Search and filter templates
- Live preview with real-time updates
- Secure payment via Razorpay
- Instant shareable page generation
- Request complex templates
- WhatsApp contact for custom work

### For Admins

- Add/edit/delete templates
- Manage template configuration via JSON
- View and manage customer requests
- Update request status
- Contact customers via WhatsApp
- Track payments and pages

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Deployment

1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Add environment variables
4. Deploy
5. Configure Razorpay webhook (optional)

## Security Notes

- RLS is enabled on all tables
- Payment verification uses HMAC signature
- Admin access requires authentication
- API keys are never exposed to client
- All Edge Functions use CORS headers

## Troubleshooting

### Payment fails
- Check Razorpay credentials
- Verify webhook signature
- Check Edge Function logs

### Template not rendering
- Verify component name matches registration
- Check JSON configuration syntax
- Review browser console for errors

### Admin access denied
- Create admin user in database
- Verify authentication
- Check RLS policies

## Support

For issues or questions:
1. Check database migrations
2. Review Edge Function logs
3. Verify environment variables
4. Test with sample data

## License

MIT
