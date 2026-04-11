// User Page Service - API calls for user page operations
// Replaces Supabase user_pages queries

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { UserPage } from '@/types';

export class PageService {
  /**
   * Get page by slug or ID (works with both)
   */
  static async getPageBySlugOrId(slugOrId: string): Promise<UserPage> {
    try {
      return await apiClient.get<UserPage>(API_ENDPOINTS.GET_PAGE(slugOrId));
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  }

  /**
   * Get page by ID
   */
  static async getPageById(id: string): Promise<UserPage> {
    try {
      return await apiClient.get<UserPage>(API_ENDPOINTS.GET_PAGE_BY_ID(id));
    } catch (error) {
      console.error('Error fetching page by ID:', error);
      throw error;
    }
  }

  /**
   * Get page by slug
   */
  static async getPageBySlug(slug: string): Promise<UserPage> {
    try {
      return await apiClient.get<UserPage>(API_ENDPOINTS.GET_PAGE_BY_SLUG(slug));
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      throw error;
    }
  }

  /**
   * Get all pages for a user email
   */
  static async getUserPages(email: string): Promise<UserPage[]> {
    try {
      const pages = await apiClient.get<UserPage[]>(API_ENDPOINTS.GET_USER_PAGES(email));
      return pages || [];
    } catch (error) {
      console.error('Error fetching user pages:', error);
      throw error;
    }
  }

  /**
   * Increment view count for a page
   */
  static async incrementViewCount(id: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.INCREMENT_VIEWS(id));
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw - view tracking failure shouldn't break the page
    }
  }

  /**
   * Deactivate a page
   */
  static async deactivatePage(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DEACTIVATE_PAGE(id));
    } catch (error) {
      console.error('Error deactivating page:', error);
      throw error;
    }
  }
}

export default PageService;

// Export instance for backward compatibility
export const pageService = PageService;

// Export UserPage type as UserPageDTO for backward compatibility
export type UserPageDTO = UserPage;
