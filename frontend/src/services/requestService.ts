// Request Service - API calls for request operations
// Replaces Supabase requests queries

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { Request } from '@/types';

export interface CreateRequestDTO {
  template_id: string;
  requester_name: string;
  requester_email: string;
  recipient_name: string;
  recipient_email: string;
  response_deadline?: string;
  custom_fields?: Record<string, any>;
  message?: string;
}

export interface UpdateRequestDTO {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  response_data?: Record<string, any>;
  response_date?: string;
}

export class RequestService {
  /**
   * Get request by ID
   */
  static async getRequestById(id: string): Promise<Request> {
    try {
      return await apiClient.get<Request>(API_ENDPOINTS.GET_REQUEST(id));
    } catch (error) {
      console.error('Error fetching request:', error);
      throw error;
    }
  }

  /**
   * Get all requests for a user (either sent or received)
   */
  static async getUserRequests(userEmail: string): Promise<Request[]> {
    try {
      const requests = await apiClient.get<Request[]>(API_ENDPOINTS.GET_USER_REQUESTS(userEmail));
      return requests || [];
    } catch (error) {
      console.error('Error fetching user requests:', error);
      throw error;
    }
  }

  /**
   * Get requests sent by a user
   */
  static async getSentRequests(userEmail: string): Promise<Request[]> {
    try {
      const requests = await apiClient.get<Request[]>(
        API_ENDPOINTS.GET_SENT_REQUESTS(userEmail)
      );
      return requests || [];
    } catch (error) {
      console.error('Error fetching sent requests:', error);
      throw error;
    }
  }

  /**
   * Get requests received by a user
   */
  static async getReceivedRequests(userEmail: string): Promise<Request[]> {
    try {
      const requests = await apiClient.get<Request[]>(
        API_ENDPOINTS.GET_RECEIVED_REQUESTS(userEmail)
      );
      return requests || [];
    } catch (error) {
      console.error('Error fetching received requests:', error);
      throw error;
    }
  }

  /**
   * Create a new request
   */
  static async createRequest(requestData: CreateRequestDTO): Promise<Request> {
    try {
      return await apiClient.post<Request>(API_ENDPOINTS.CREATE_REQUEST, requestData);
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  /**
   * Update request status or response
   */
  static async updateRequest(id: string, updates: UpdateRequestDTO): Promise<Request> {
    try {
      return await apiClient.put<Request>(API_ENDPOINTS.UPDATE_REQUEST(id), updates);
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  }

  /**
   * Accept a request
   */
  static async acceptRequest(id: string, responseData?: Record<string, any>): Promise<Request> {
    try {
      return await this.updateRequest(id, {
        status: 'ACCEPTED',
        response_data: responseData,
        response_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      throw error;
    }
  }

  /**
   * Reject a request
   */
  static async rejectRequest(id: string): Promise<Request> {
    try {
      return await this.updateRequest(id, {
        status: 'REJECTED',
        response_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  }

  /**
   * Delete a request
   */
  static async deleteRequest(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DELETE_REQUEST(id));
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  }
}

export default RequestService;
