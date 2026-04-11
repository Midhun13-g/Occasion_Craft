// Application configuration for TemplateMart Frontend

export const APP_CONFIG = {
  // App metadata
  APP_NAME: 'TemplateMart',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Personal template marketplace with live preview and Razorpay payments',

  // API configuration
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000 as number, // 30 seconds

  // Razorpay configuration
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',

  // Pagination
  ITEMS_PER_PAGE: 12,
  ITEMS_PER_PAGE_ADMIN: 20,

  // Image upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  IMAGE_COMPRESSION_QUALITY: 0.8,

  // Template categories
  TEMPLATE_CATEGORIES: [
    'birthday',
    'wedding',
    'anniversary',
    'congratulations',
    'thank-you',
    'invitation',
    'announcement',
    'custom',
  ],

  // Template types
  TEMPLATE_TYPES: [
    { value: 'SIMPLE', label: 'Simple (quick & easy)' },
    { value: 'COMPLEX', label: 'Complex (advanced)' },
  ],

  // Preview types
  PREVIEW_TYPES: [
    { value: 'IMAGE', label: 'Image' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'IFRAME', label: 'Interactive (iframe)' },
  ],

  // Form field types
  FORM_FIELD_TYPES: [
    'text',
    'textarea',
    'email',
    'tel',
    'date',
    'color',
    'select',
    'image',
  ],

  // Cache durations (in milliseconds)
  CACHE_DURATION: {
    TEMPLATES: 5 * 60 * 1000, // 5 minutes
    PAGES: 1 * 60 * 1000, // 1 minute
  },

  // UI settings
  ANIMATION_DURATION: 300, // ms
  TOAST_DURATION: 3000, // ms

  // Feature flags
  FEATURES: {
    CLOUDINARY_UPLOAD: true,
    TEMPLATE_VERSIONING: false,
    ANALYTICS: false,
    AI_SUGGESTIONS: true,
  },

  // Payment settings
  PAYMENT: {
    CURRENCY: 'INR',
    MIN_AMOUNT: 99,
    MAX_AMOUNT: 999999,
  },
};

export default APP_CONFIG;
