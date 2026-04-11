// Messages and error handling for TemplateMart

export const MESSAGES = {
  // Success messages
  SUCCESS: {
    TEMPLATE_CREATED: 'Template created successfully!',
    TEMPLATE_UPDATED: 'Template updated successfully!',
    PAYMENT_SUCCESSFUL: 'Payment completed successfully!',
    PAGE_CREATED: 'Your personalized page has been created!',
    COPY_TO_CLIPBOARD: 'Link copied to clipboard!',
  },

  // Error messages
  ERROR: {
    TEMPLATE_NOT_FOUND: 'Template not found. Please try again.',
    PAYMENT_FAILED: 'Payment failed. Please try again.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_FORM: 'Please fill in all required fields.',
    IMAGE_UPLOAD_FAILED: 'Failed to upload image. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },

  // Info messages
  INFO: {
    LOADING_TEMPLATES: 'Loading templates...',
    GENERATING_PAGE: 'Generating your personalized page...',
    VERIFYING_PAYMENT: 'Verifying payment...',
    UPDATING_PREVIEW: 'Updating preview...',
  },

  // Validation
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL_FORMAT: 'Please enter a valid email address.',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    FILE_TOO_LARGE: 'File size must be less than 10MB.',
  },

  // Actions
  ACTION: {
    CONFIRM_DELETE: 'Are you sure? This action cannot be undone.',
    CONFIRM_DEACTIVATE: 'This will deactivate the page. Continue?',
  },
};

export default MESSAGES;
