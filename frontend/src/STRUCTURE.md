/**
 * TemplateMart Frontend Architecture
 * 
 * Frontend Structure:
 * 
 * src/
 * ├── components/          # Reusable UI components
 * │   ├── common/          # Shared components (Layout, Loading, etc.)
 * │   ├── forms/           # Form-related components
 * │   └── templates/       # Template display components
 * │
 * ├── pages/               # Page components (React Router routes)
 * │   ├── public/          # Public pages
 * │   └── admin/           # Admin pages
 * │
 * ├── services/            # API service layer
 * │   ├── api.ts           # HTTP client
 * │   ├── templateService.ts
 * │   ├── paymentService.ts
 * │   └── pageService.ts
 * │
 * ├── hooks/               # Custom React hooks
 * │   ├── useTemplates.ts
 * │   ├── usePayment.ts
 * │   └── usePages.ts
 * │
 * ├── types/               # TypeScript interfaces
 * │   ├── index.ts
 * │   ├── api.ts
 * │   ├── database.ts
 * │   └── forms.ts
 * │
 * ├── utils/               # Utility functions
 * │   ├── slug.ts
 * │   ├── validation.ts
 * │   └── formatting.ts
 * │
 * ├── constants/           # Constants & config
 * │   ├── endpoints.ts
 * │   ├── messages.ts
 * │   └── config.ts
 * │
 * ├── styles/              # Global styles
 * │   ├── index.css
 * │   ├── components.css
 * │   └── layout.css
 * │
 * ├── lib/                 # Third-party integrations
 * │   ├── supabase.ts      # (deprecated - use Spring Boot API)
 * │   └── api.ts           # HTTP client setup
 * │
 * ├── App.tsx              # Root component
 * ├── main.tsx             # Entry point
 * └── vite-env.d.ts        # Vite types
 */

// This file serves as documentation for the frontend structure
export const FRONTEND_STRUCTURE = "See comments above";
