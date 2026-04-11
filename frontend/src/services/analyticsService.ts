import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDashboardAnalytics = async () => {
  const response = await axios.get(`${API_URL}/admin/analytics/dashboard`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getTemplateAnalytics = async (templateId: string) => {
  const response = await axios.get(`${API_URL}/admin/analytics/template/${templateId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};
