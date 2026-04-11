// API Constants - Centralized API endpoint definitions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Template Endpoints
  TEMPLATES: `${API_BASE_URL}/templates`,
  TEMPLATE_BY_ID: (id: string) => `${API_BASE_URL}/templates/${id}`,
  TEMPLATES_BY_TYPE: (type: string) => `${API_BASE_URL}/templates/type/${type}`,
  TEMPLATES_BY_CATEGORY: (category: string) => `${API_BASE_URL}/templates/category/${category}`,
  TEMPLATES_SEARCH: (query: string) => `${API_BASE_URL}/templates/search?q=${encodeURIComponent(query)}`,
  CREATE_TEMPLATE: `${API_BASE_URL}/templates`,
  UPDATE_TEMPLATE: (id: string) => `${API_BASE_URL}/templates/${id}`,
  DELETE_TEMPLATE: (id: string) => `${API_BASE_URL}/templates/${id}`,
  TOGGLE_TEMPLATE_ACTIVE: (id: string) => `${API_BASE_URL}/templates/${id}/toggle-active`,

  // User Page Endpoints
  GET_PAGE: (slugOrId: string) => `${API_BASE_URL}/pages/${slugOrId}`,
  GET_PAGE_BY_ID: (id: string) => `${API_BASE_URL}/pages/id/${id}`,
  GET_PAGE_BY_SLUG: (slug: string) => `${API_BASE_URL}/pages/slug/${slug}`,
  GET_USER_PAGES: (email: string) => `${API_BASE_URL}/pages/user/${encodeURIComponent(email)}`,
  INCREMENT_VIEWS: (id: string) => `${API_BASE_URL}/pages/${id}/views`,
  DEACTIVATE_PAGE: (id: string) => `${API_BASE_URL}/pages/${id}/deactivate`,

  // Payment Endpoints
  CREATE_ORDER: `${API_BASE_URL}/payments/create-order`,
  VERIFY_PAYMENT: `${API_BASE_URL}/payments/verify-payment`,
  GET_ORDER: (orderId: string) => `${API_BASE_URL}/payments/orders/${orderId}`,
  GET_USER_ORDERS: (userEmail: string) => `${API_BASE_URL}/payments/orders/user/${encodeURIComponent(userEmail)}`,
  GET_ORDER_STATUS: (orderId: string) => `${API_BASE_URL}/payments/orders/${orderId}/status`,
  PAYMENT_WEBHOOK: `${API_BASE_URL}/payments/webhook`,

  // Request Endpoints (if needed)
  GET_REQUEST: (id: string) => `${API_BASE_URL}/requests/${id}`,
  GET_USER_REQUESTS: (email: string) => `${API_BASE_URL}/requests/user/${encodeURIComponent(email)}`,
  GET_SENT_REQUESTS: (email: string) => `${API_BASE_URL}/requests/sent/${encodeURIComponent(email)}`,
  GET_RECEIVED_REQUESTS: (email: string) => `${API_BASE_URL}/requests/received/${encodeURIComponent(email)}`,
  CREATE_REQUEST: `${API_BASE_URL}/requests`,
  UPDATE_REQUEST: (id: string) => `${API_BASE_URL}/requests/${id}`,
};

// Auth Config
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
};

// App Config
export const APP_CONFIG = {
  APP_NAME: 'TemplateMart',
  API_BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  CORS_ALLOWED_ORIGINS: import.meta.env.VITE_CORS_ORIGINS || 'http://localhost:5173',
};
