import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Validate API URL to prevent using MongoDB URI by mistake
if (API_URL.startsWith('mongodb')) {
  console.error('❌ ERROR: REACT_APP_API_URL is set to a MongoDB URI instead of an HTTP URL!');
  console.error('Please check your frontend/.env file');
  console.error('For production: REACT_APP_API_URL=https://assignment-slotswapper.onrender.com/api');
  console.error('For local: REACT_APP_API_URL=http://localhost:5000/api');
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

