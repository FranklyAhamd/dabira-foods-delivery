import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load stored authentication data when the app starts
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

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
      setError(null);

      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        phone
      });

      const { token, user } = response.data;

      // Store authentication data
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      Alert.alert('Registration Error', message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data.data;

      // Store authentication data
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      Alert.alert('Login Error', message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear stored authentication data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

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
      setError(null);

      const response = await api.put('/auth/profile', userData);
      const updatedUser = response.data.data.user;

      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(message);
      Alert.alert('Update Error', message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Get current user profile
  const getProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/auth/profile');
      const currentUser = response.data.data.user;

      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(currentUser));
      setUser(currentUser);

      return { success: true, user: currentUser };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch profile. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    updateProfile,
    getProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;



