import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Retry configuration for network resilience
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Retry logic function
const retryRequest = async (config, retryCount = 0) => {
  try {
    return await axios(config);
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      throw error;
    }

    if (retryCount < MAX_RETRIES && (
      !error.response || 
      error.response.status >= 500 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      error.message === 'Network Error'
    )) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES}) after ${delay}ms...`);
      return retryRequest(config, retryCount + 1);
    }
    throw error;
  }
};

// Create axios instance with better timeout for Nigerian networks
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds for slower networks
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses with retry logic
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (!originalRequest._retry && (
      !error.response ||
      error.response.status >= 500 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      error.message === 'Network Error'
    )) {
      originalRequest._retry = true;
      try {
        return await retryRequest(originalRequest);
      } catch (retryError) {
        if (retryError.message === 'Network Error' || retryError.code === 'ECONNABORTED') {
          retryError.userMessage = 'Network connection issue. Please check your internet connection (Airtel, MTN, Glo, etc.) and try again.';
        }
        return Promise.reject(retryError);
      }
    }

    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      error.userMessage = 'Unable to connect to server. Please check your internet connection and try again.';
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };











