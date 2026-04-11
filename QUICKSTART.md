# Quick Start Guide

Get your template marketplace up and running in 5 minutes!

## Step 1: Configure Razorpay (2 minutes)

1. Go to [razorpay.com](https://razorpay.com) and sign up
2. Navigate to Settings → API Keys
3. Copy your Key ID
4. Add to `.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

## Step 2: Add Sample Templates (1 minute)

Open your Supabase SQL Editor and run:

```sql
INSERT INTO templates (name, description, type, category, price, preview_url, preview_type, component_name, is_active, features, config, demo_data) VALUES
(
  'Birthday Celebration',
  'A beautiful birthday template with customizable colors, images, and messages.',
  'simple',
  'birthday',
  299,
  'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg',
  'image',
  'BirthdayTemplate',
  true,
  ARRAY['Customizable colors', 'Image upload', 'Personal message', 'Instant sharing'],
  '{"fields": [{"id": "name", "type": "text", "label": "Birthday Person Name", "placeholder": "Enter name", "required": true}, {"id": "age", "type": "text", "label": "Age", "placeholder": "Enter age", "required": true}, {"id": "message", "type": "textarea", "label": "Birthday Message", "placeholder": "Write your wishes...", "required": true, "aiSuggestion": true}, {"id": "primaryColor", "type": "color", "label": "Primary Color", "required": true, "defaultValue": "#FF6B9D"}, {"id": "secondaryColor", "type": "color", "label": "Secondary Color", "required": true, "defaultValue": "#FFC93C"}, {"id": "imageUrl", "type": "image", "label": "Background Image URL", "placeholder": "https://example.com/image.jpg", "required": false}]}',
  '{"name": "John Doe", "age": "25", "message": "Wishing you a day filled with happiness!", "primaryColor": "#FF6B9D", "secondaryColor": "#FFC93C", "imageUrl": "https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg"}'
),
(
  'Wedding Invitation',
  'Elegant wedding invitation template with customizable details.',
  'simple',
  'wedding',
  499,
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg',
  'image',
  'WeddingTemplate',
  true,
  ARRAY['Elegant design', 'Date and venue', 'Custom message', 'Mobile responsive'],
  '{"fields": [{"id": "bride", "type": "text", "label": "Bride Name", "placeholder": "Enter bride name", "required": true}, {"id": "groom", "type": "text", "label": "Groom Name", "placeholder": "Enter groom name", "required": true}, {"id": "date", "type": "date", "label": "Wedding Date", "required": true}, {"id": "venue", "type": "text", "label": "Venue", "placeholder": "Enter venue name", "required": true}, {"id": "message", "type": "textarea", "label": "Invitation Message", "placeholder": "Write your message...", "required": true, "aiSuggestion": true}, {"id": "imageUrl", "type": "image", "label": "Cover Image URL", "placeholder": "https://example.com/image.jpg", "required": false}]}',
  '{"bride": "Sarah", "groom": "Michael", "date": "2026-12-31", "venue": "Garden Palace Hotel", "message": "Join us as we celebrate our special day", "imageUrl": "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg"}'
);
```

## Step 3: Start Development Server (30 seconds)

```bash
npm run dev
```

Open http://localhost:5173

## Step 4: Test the Application (1 minute)

### Test Simple Templates
1. Click "Browse Templates"
2. Select "Birthday Celebration"
3. Fill in the form
4. See live preview update
5. Click "Proceed to Payment"

### Test Complex Templates
Add a complex template:

```sql
INSERT INTO templates (name, description, type, category, price, preview_url, preview_type, component_name, is_active, features, config, demo_data) VALUES
(
  'Premium Business Portfolio',
  'A premium business portfolio requiring personal consultation.',
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

## Step 5: Create Admin User (Optional)

1. Sign up through Supabase Auth
2. Get your user ID from Supabase Dashboard → Authentication
3. Run in SQL Editor:

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('your-user-id-here', 'admin@example.com', 'super_admin');
```

4. Visit `/admin` to manage templates

## Testing Payment Flow

### Using Razorpay Test Mode

1. Ensure you're using test keys (starts with `rzp_test_`)
2. Customize a template
3. Proceed to checkout
4. Use test card: `4111 1111 1111 1111`
5. Any future date and CVV
6. Complete payment
7. Get redirected to shareable page!

### Test Cards

| Card Number | Type | Result |
|-------------|------|--------|
| 4111 1111 1111 1111 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |

## What You Have Now

✅ Full-featured template marketplace
✅ 2 working templates (Birthday, Wedding)
✅ Dynamic form generation
✅ Live preview system
✅ Payment integration
✅ Shareable pages
✅ Admin panel
✅ Request system

## Next Steps

### Add More Templates

1. Create component in `src/components/templates/`
2. Register in `TemplatePreview.tsx`
3. Add via admin panel or SQL

### Customize Design

- Edit components for your brand
- Update colors in Tailwind config
- Add your logo

### Deploy to Production

1. Push to GitHub
2. Connect to Vercel/Netlify
3. Add environment variables
4. Deploy!

### Switch to Live Mode

1. Get Razorpay live keys
2. Update environment variables
3. Test with small amount
4. Go live!

## Common Issues

### "Template not found"
- Check if template is marked as active
- Verify component name matches

### Payment not working
- Verify Razorpay key ID in .env
- Check Edge Function logs
- Ensure using test card in test mode

### Preview not updating
- Check browser console for errors
- Verify field IDs match config
- Reload page

## Get Help

- 📖 Read `README.md` for overview
- 🏗️ Check `ARCHITECTURE.md` for technical details
- ⚙️ See `SETUP.md` for detailed setup
- 📋 Review `sample-configs.json` for examples

## Tips for Success

1. **Start Simple**: Test with provided templates first
2. **Use Test Mode**: Always test payments in test mode
3. **Check Logs**: Use browser console and Supabase logs
4. **Follow Examples**: Reference sample configurations
5. **Iterate**: Add features gradually

## You're Ready!

Your template marketplace is now running. Start by:

1. Browsing templates at `/templates`
2. Testing the purchase flow
3. Accessing admin panel at `/admin`
4. Creating your first custom template

**Happy building! 🚀**
