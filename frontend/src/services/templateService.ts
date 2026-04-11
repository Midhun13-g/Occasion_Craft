// Template Service - API calls for template operations
// Replaces Supabase template queries

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { Template } from '@/types';

export class TemplateService {
  /**
   * Get all active templates
   */
  static async getAllTemplates(): Promise<Template[]> {
    try {
      const templates = await apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATES);
      return templates || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  /**
   * Get all templates for admin (including inactive)
   */
  static async getAllTemplatesForAdmin(): Promise<Template[]> {
    try {
      const templates = await apiClient.get<Template[]>(`${API_ENDPOINTS.TEMPLATES}/admin/all`);
      return templates || [];
    } catch (error) {
      console.error('Error fetching templates for admin:', error);
      throw error;
    }
  }

  /**
   * Get single template by ID
   */
  static async getTemplateById(id: string): Promise<Template> {
    try {
      return await apiClient.get<Template>(API_ENDPOINTS.TEMPLATE_BY_ID(id));
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  /**
   * Get templates filtered by type
   */
  static async getTemplatesByType(type: 'SIMPLE' | 'COMPLEX'): Promise<Template[]> {
    try {
      const templates = await apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATES_BY_TYPE(type));
      return templates || [];
    } catch (error) {
      console.error('Error fetching templates by type:', error);
      throw error;
    }
  }

  /**
   * Get templates filtered by category
   */
  static async getTemplatesByCategory(category: string): Promise<Template[]> {
    try {
      const templates = await apiClient.get<Template[]>(
        API_ENDPOINTS.TEMPLATES_BY_CATEGORY(category)
      );
      return templates || [];
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      throw error;
    }
  }

  /**
   * Search templates
   */
  static async searchTemplates(query: string): Promise<Template[]> {
    try {
      const templates = await apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATES_SEARCH(query));
      return templates || [];
    } catch (error) {
      console.error('Error searching templates:', error);
      throw error;
    }
  }

  /**
   * Create new template (admin)
   */
  static async createTemplate(template: Partial<Template>): Promise<Template> {
    try {
      return await apiClient.post<Template>(API_ENDPOINTS.CREATE_TEMPLATE, template);
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  /**
   * Update template (admin)
   */
  static async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    try {
      return await apiClient.put<Template>(API_ENDPOINTS.UPDATE_TEMPLATE(id), updates);
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  /**
   * Delete template (admin)
   */
  static async deleteTemplate(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DELETE_TEMPLATE(id));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  /**
   * Toggle template active status (admin)
   */
  static async toggleTemplateActive(id: string): Promise<void> {
    try {
      await apiClient.patch(API_ENDPOINTS.TOGGLE_TEMPLATE_ACTIVE(id));
    } catch (error) {
      console.error('Error toggling template active:', error);
      throw error;
    }
  }
}

export default TemplateService;

// Export instance for backward compatibility
export const templateService = TemplateService;

// Export Template type as TemplateDTO for backward compatibility
export type TemplateDTO = Template;
