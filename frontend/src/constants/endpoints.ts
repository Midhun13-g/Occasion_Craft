// API Endpoints for TemplateMart Backend
// Replace with your backend URL (default: http://localhost:8080/api)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Templates
  TEMPLATES: `${API_BASE_URL}/templates`,
  TEMPLATE_BY_ID: (id: string) => `${API_BASE_URL}/templates/${id}`,
  TEMPLATES_BY_TYPE: (type: string) => `${API_BASE_URL}/templates/type/${type}`,
  TEMPLATES_BY_CATEGORY: (category: string) => `${API_BASE_URL}/templates/category/${category}`,
  TEMPLATES_SEARCH: (query: string) => `${API_BASE_URL}/templates/search?q=${query}`,
  CREATE_TEMPLATE: `${API_BASE_URL}/templates`,
  UPDATE_TEMPLATE: (id: string) => `${API_BASE_URL}/templates/${id}`,
  DELETE_TEMPLATE: (id: string) => `${API_BASE_URL}/templates/${id}`,
  TOGGLE_TEMPLATE_ACTIVE: (id: string) => `${API_BASE_URL}/templates/${id}/toggle-active`,

  // Payments
  CREATE_ORDER: `${API_BASE_URL}/payments/create-order`,
  VERIFY_PAYMENT: `${API_BASE_URL}/payments/verify-payment`,

  // Authentication
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,
  AUTH_UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  AUTH_PASSWORD_RESET: `${API_BASE_URL}/auth/password-reset`,
  AUTH_RESET_CONFIRM: `${API_BASE_URL}/auth/reset-confirm`,
  AUTH_VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,

  // Pages
  GET_PAGE: (slugOrId: string) => `${API_BASE_URL}/pages/${slugOrId}`,
  GET_PAGE_BY_ID: (id: string) => `${API_BASE_URL}/pages/id/${id}`,
  GET_PAGE_BY_SLUG: (slug: string) => `${API_BASE_URL}/pages/slug/${slug}`,
  GET_USER_PAGES: (email: string) => `${API_BASE_URL}/pages/user/${email}`,
  INCREMENT_VIEWS: (id: string) => `${API_BASE_URL}/pages/${id}/view`,
  DEACTIVATE_PAGE: (id: string) => `${API_BASE_URL}/pages/${id}`,

  // Analytics
  ANALYTICS: `${API_BASE_URL}/analytics`,
};

export default API_ENDPOINTS;
