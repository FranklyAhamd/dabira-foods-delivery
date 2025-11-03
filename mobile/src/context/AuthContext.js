import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored authentication data when the app starts
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error loading authentication data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Register a new user
  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        phone
      });

      // Check if response indicates an error (400 responses don't throw due to validateStatus)
      if (response.success === false) {
        // Handle validation errors and other errors
        let message = 'Registration failed. Please try again.';
        
        // Check for validation errors array first
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          message = response.errors.map(err => err.msg || err.message).join(', ');
        } 
        // Then check for direct message (like "email already exists")
        else if (response.message) {
          message = response.message;
        }
        
        // Ensure we always return a meaningful error message
        return { success: false, message };
      }

      // Backend returns data in response.data structure for successful responses
      const { token, user } = response.data;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true };
    } catch (err) {
      // Handle network errors and other exceptions
      let message = 'Registration failed. Please try again.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check for validation errors array
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          message = errorData.errors.map(err => err.msg || err.message).join(', ');
        } else if (errorData.message) {
          message = errorData.message;
        }
      } else if (err.message) {
        message = err.message;
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password
      });

      // Check if response indicates an error (400 responses don't throw due to validateStatus)
      if (response.success === false) {
        // Handle validation errors and other errors
        let message = 'Login failed. Please check your credentials.';
        
        // Check for validation errors array
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          message = response.errors.map(err => err.msg || err.message).join(', ');
        } else if (response.message) {
          message = response.message;
        }
        
        return { success: false, message };
      }

      // Backend returns data in response.data structure for successful responses
      const { token, user } = response.data;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true };
    } catch (err) {
      // Handle network errors and other exceptions
      let message = 'Login failed. Please check your credentials.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check for validation errors array
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          message = errorData.errors.map(err => err.msg || err.message).join(', ');
        } else if (errorData.message) {
          message = errorData.message;
        }
      } else if (err.message) {
        message = err.message;
      }
      
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = () => {
    try {
      setLoading(true);
      
      // Clear stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);

      const response = await api.put('/auth/profile', userData);
      const updatedUser = response.data.data.user;

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;




