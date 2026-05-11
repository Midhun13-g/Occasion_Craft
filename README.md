# Occasion Craft 🎉

AI-powered occasion template marketplace for creating beautiful celebration pages instantly.

---

# ✨ Features

## 👤 Customer Features

- Browse and search templates
- Filter by category and type
- Live preview updates
- Dynamic JSON-based forms
- AI-powered content suggestions
- Razorpay payment integration
- Instant shareable pages
- WhatsApp support integration
- Custom template request system

---

## 🛠️ Admin Features

- Template CRUD management
- Request management dashboard
- Payment tracking
- Customer communication
- Template configuration system
- Status tracking for requests

---

# 🎭 Template Types

## ⚡ Simple Templates

Automated flow:

1. Customize template
2. Preview instantly
3. Complete payment
4. Get public shareable page

---

## 🎨 Complex Templates

Manual flow:

1. Submit customization request
2. Admin contacts customer
3. Custom quote & timeline
4. Manual delivery

---

# 🧱 Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase Edge Functions |
| Database | PostgreSQL |
| Payments | Razorpay |
| Deployment | Vercel / Netlify |

---

# 📂 Project Structure

```bash
src/
├── components/
│   ├── DynamicForm.tsx
│   ├── TemplatePreview.tsx
│   ├── RequestTemplateForm.tsx
│   └── templates/
│       ├── BirthdayTemplate.tsx
│       └── WeddingTemplate.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── TemplateList.tsx
│   ├── TemplateDetail.tsx
│   ├── Checkout.tsx
│   ├── ViewPage.tsx
│   └── admin/
│
├── lib/
├── types/
└── utils/

supabase/
└── functions/
    ├── create-order/
    └── verify-payment/
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/occasion-craft.git
cd occasion-craft
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

# 🗄️ Database Tables

| Table | Purpose |
|---|---|
| templates | Template metadata |
| user_pages | Generated pages |
| payments | Payment records |
| template_requests | Custom requests |
| admin_users | Admin access |

---

# 💳 Payment Flow

```text
Customize Template
        ↓
Proceed to Payment
        ↓
Create Razorpay Order
        ↓
Verify Payment
        ↓
Generate Shareable Page
```

---

# 🎨 Dynamic Template Config

Example JSON configuration:

```json
{
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Name",
      "required": true
    },
    {
      "id": "message",
      "type": "textarea",
      "label": "Message",
      "aiSuggestion": true
    }
  ]
}
```

---

# 🧩 Supported Field Types

- text
- textarea
- email
- tel
- date
- select
- color
- image

---

# ➕ Adding New Templates

## Create Component

```tsx
export default function YourTemplate({ data }) {
  return <div>Your Template</div>;
}
```

---

## Register Template

```tsx
const templateComponents = {
  BirthdayTemplate,
  WeddingTemplate,
  YourTemplate,
};
```

---

## Add Template to Database

```sql
INSERT INTO templates (
  name,
  component_name
)
VALUES (
  'Your Template',
  'YourTemplate'
);
```

---

# 🔒 Security

- Row Level Security (RLS)
- Secure payment verification
- Protected admin routes
- Environment variable protection

---

# 🌍 Deployment

## Frontend

Deploy using:

- Vercel
- Netlify

---

## Backend

Supabase Edge Functions:

- create-order
- verify-payment

---

# 🧪 Razorpay Test Card

```text
4111 1111 1111 1111
```

---

# 👨‍💼 Admin Setup

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
  'user-uuid',
  'admin@example.com',
  'super_admin'
);
```

---

# 📚 Documentation

| File | Description |
|---|---|
| SETUP.md | Setup instructions |
| ARCHITECTURE.md | Architecture details |
| sample-configs.json | Template configs |

---

# 🛣️ Roadmap

- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Template versioning
- [ ] Multi-language support
- [ ] Custom domains

---

# 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push changes
5. Open pull request

---

# 📄 License

MIT License

---

# ❤️ Built With

- React
- TypeScript
- Supabase
- Tailwind CSS
- Razorpay

---

# 🚀 Run Project

```bash
npm run dev
```
