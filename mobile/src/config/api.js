import axios from 'axios';

// Automatically detect API URL based on current hostname
// If accessed via network IP (e.g., 192.168.x.x), use that IP for API calls
// Otherwise, fall back to localhost or environment variable
const getApiUrl = () => {
  // Check if REACT_APP_API_URL is set in environment
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Get current hostname (localhost or network IP)
  const hostname = window.location.hostname;
  
  // If accessing via network IP (not localhost), use that IP for API
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:5000/api`;
  }
  
  // Default to localhost for local development
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Retry configuration for network resilience
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Start with 1 second

// Retry logic function
const retryRequest = async (config, retryCount = 0) => {
  try {
    return await axios(config);
  } catch (error) {
    // Don't retry on 4xx errors (client errors)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      throw error;
    }

    // Retry on network errors or 5xx errors
    if (retryCount < MAX_RETRIES && (
      !error.response || 
      error.response.status >= 500 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      error.message === 'Network Error'
    )) {
      // Exponential backoff: wait longer each retry (1s, 2s, 4s)
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
  timeout: 30000, // Increased to 30 seconds for slower networks
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Don't throw on 4xx
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
    // Handle authentication errors immediately
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // For network errors, try to retry
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
        // If retries failed, enhance error message
        if (retryError.message === 'Network Error' || retryError.code === 'ECONNABORTED') {
          retryError.userMessage = 'Network connection issue. Please check your internet connection (Airtel, MTN, Glo, etc.) and try again.';
        }
        return Promise.reject(retryError);
      }
    }

    // Enhance error messages for better UX
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      error.userMessage = 'Unable to connect to server. Please check your internet connection and try again.';
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
