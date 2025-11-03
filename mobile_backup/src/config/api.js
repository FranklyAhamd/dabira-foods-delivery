import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - update this to match your backend
const API_URL = 'http://192.168.41.12:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error setting auth token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        // Navigation will be handled by the auth context
      } catch (e) {
        console.error('Error clearing auth data:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
