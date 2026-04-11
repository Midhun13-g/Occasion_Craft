import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  templateCount: number;
}

export class CategoryService {
  static async getAllCategories(): Promise<CategoryDTO[]> {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  static async getCategoryById(id: string): Promise<CategoryDTO> {
    const response = await axios.get(`${API_URL}/categories/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  static async createCategory(data: Omit<CategoryDTO, 'id' | 'templateCount'>): Promise<CategoryDTO> {
    const response = await axios.post(`${API_URL}/categories`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  static async updateCategory(id: string, data: Omit<CategoryDTO, 'id' | 'templateCount'>): Promise<CategoryDTO> {
    const response = await axios.put(`${API_URL}/categories/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  static async deleteCategory(id: string): Promise<void> {
    await axios.delete(`${API_URL}/categories/${id}`, {
      headers: getAuthHeader()
    });
  }

  static async toggleActive(id: string): Promise<CategoryDTO> {
    const response = await axios.patch(`${API_URL}/categories/${id}/toggle`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}

export default CategoryService;
