import apiClient from './apiClient';
import { LoginCredentials, AuthResponse, Usuario } from '@/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  me: async (): Promise<Usuario> => {
    const { data } = await apiClient.get<Usuario>('/auth/me');
    return data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};
