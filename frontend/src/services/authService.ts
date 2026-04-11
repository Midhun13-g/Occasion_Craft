// Auth Service - API calls for authentication operations
// Handles user registration, login, and profile management

import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/endpoints';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export class AuthService {
  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Registering with endpoint:', API_ENDPOINTS.AUTH_REGISTER);
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, data);
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Logging in with endpoint:', API_ENDPOINTS.AUTH_LOGIN);
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, data);
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<UserProfile> {
    try {
      return await apiClient.get<UserProfile>(API_ENDPOINTS.AUTH_ME);
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      return await apiClient.put<UserProfile>(API_ENDPOINTS.AUTH_UPDATE_PROFILE, updates);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH_PASSWORD_RESET, {
        email,
      });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }

  /**
   * Confirm password reset with token
   */
  static async confirmPasswordReset(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH_RESET_CONFIRM, {
        token,
        password: newPassword,
      });
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH_VERIFY_EMAIL, {
        token,
      });
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get auth token from storage
   */
  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export default AuthService;
