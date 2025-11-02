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
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      return response.data;
    } catch (error: any) {
      // Extract meaningful error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Signup failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
  
  updateProfile: async (name: string, email: string): Promise<{ user: User; message: string }> => {
    try {
      const response = await api.put('/auth/profile', { name, email });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update profile.';
      throw new Error(errorMessage);
    }
  },

  resetPassword: async (email: string, newPassword: string): Promise<{ message: string }> => {
    try {
      const response = await api.post('/auth/reset-password', { email, newPassword });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to reset password.';
      throw new Error(errorMessage);
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      // Extract meaningful error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please check your credentials and try again.';
      throw new Error(errorMessage);
    }
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to get user information.';
      throw new Error(errorMessage);
    }
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
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};

