import api from './axiosClient';

export const authService = {
  // Login
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login/', {
        username,
        password
      });
      
      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout/');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me/');
      return response.data;
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  // Get stored user
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};