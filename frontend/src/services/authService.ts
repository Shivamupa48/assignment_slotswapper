import api from '../utils/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface SignupResponse {
  message: string;
  user: User;
}

export const authService = {
  signup: async (name: string, email: string, password: string): Promise<SignupResponse> => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },
  
  updateProfile: async (name: string, email: string): Promise<{ user: User; message: string }> => {
    const response = await api.put('/auth/profile', { name, email });
    return response.data;
  },

  resetPassword: async (email: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', { email, newPassword });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

