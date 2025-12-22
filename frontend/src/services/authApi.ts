import apiClient from './apiClient';
import { LoginCredentials, AuthResponse, Usuario } from '@/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // Token is now in HttpOnly cookie
    localStorage.setItem('user', JSON.stringify(data.user)); // Keep user for UI
    return data;
  },

  me: async (): Promise<Usuario> => {
    const { data } = await apiClient.get<Usuario>('/auth/me');
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error('Error logging out', e);
    } finally {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user'); // Check for user existence
  }
};
