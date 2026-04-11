// HTTP Client for communicating with Spring Boot Backend
// Replaces Supabase client for REST API calls

import { APP_CONFIG, API_ENDPOINTS } from '@/constants';

export interface HttpClientOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  body?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl = APP_CONFIG.API_BASE_URL, timeout = APP_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options: HttpClientOptions = {}
  ): Promise<T> {
    // Validate endpoint
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint provided');
    }

    const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`);

    console.log(`[API] ${method} ${url.toString()}`);

    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add JWT token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (options.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(options.body);
      console.log('[API] Request body:', options.body);
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);
      console.log(`[API] Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('[API] Error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[API] Response data:', data);
      return data as T;
    } catch (error) {
      console.error('[API] Request failed:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Backend server is not running. Please start the backend at http://localhost:8080');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options: HttpClientOptions = {}): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  async post<T>(endpoint: string, body?: unknown, options: HttpClientOptions = {}): Promise<T> {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  async put<T>(endpoint: string, body?: unknown, options: HttpClientOptions = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  async patch<T>(endpoint: string, body?: unknown, options: HttpClientOptions = {}): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...options, body });
  }

  async delete<T>(endpoint: string, options: HttpClientOptions = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }
}

// Export singleton instance
export const apiClient = new HttpClient();

export default HttpClient;
