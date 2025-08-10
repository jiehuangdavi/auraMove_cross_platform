import { useRouter } from 'expo-router';
import React, { useState, createContext, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginAPI, register as registerAPI, getUserProfile } from './authService';

const AuthContext = createContext(null);
/*
The app's authentication state is maintained through a sophisticated system that:
Centralizes all auth logic in a React Context
Persists data securely using Expo SecureStore
Automatically validates tokens on app startup
Injects tokens into all API requests
Protects routes based on authentication status
Synchronizes state across all components
Handles loading states and error conditions
Provides a clean API for components to access auth state
*/
// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

// Route protection is now handled by _layout.js to prevent conflicts

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
/*
The authentication state is automatically synchronized across the entire app:
Single Source of Truth: All components read from the same auth context
Real-time Updates: State changes immediately reflect in all components
*/ 
  useEffect(() => {
    // Check for stored authentication data on app start
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('🔐 [authContext] Checking authentication state...');
      const token = await SecureStore.getItemAsync('authToken');
      console.log('🔐 [authContext] Token found in SecureStore:', token ? 'Yes' : 'No');
      
      if (token) {
        // Validate token by getting user profile from backend
        try {
          console.log('🔐 [authContext] Validating token with backend...');
          const userData = await getUserProfile();
          console.log('🔐 [authContext] Token validation successful, user data:', userData ? 'Yes' : 'No');
          setUser(userData);
        } catch (error) {
          // Token is invalid, remove it
          console.error('Invalid token:', error);
          await SecureStore.deleteItemAsync('authToken');
          await SecureStore.deleteItemAsync('userData');
          console.log('🔐 [authContext] Invalid token removed from SecureStore');
        }
      } else {
        console.log('🔐 [authContext] No token found, user is not authenticated');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
      console.log('🔐 [authContext] Auth state check completed, isLoading set to false');
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 [authContext] Starting login process...');
      setIsLoading(true);
      
      // Call the backend API
      const response = await loginAPI(email, password);
      console.log('🔐 [authContext] Login API response received');
      
      // Store the token
      await SecureStore.setItemAsync('authToken', response.token);
      console.log('🔐 [authContext] Token stored in SecureStore');
      
      // Get user profile data
      const userData = await getUserProfile();
      console.log('🔐 [authContext] User profile retrieved:', userData ? 'Yes' : 'No');
      
      // Store user data
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      console.log('🔐 [authContext] User data stored in SecureStore');
      
      setUser(userData);
      console.log('🔐 [authContext] User state updated, user:', userData ? 'authenticated' : 'null');
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('🔐 [authContext] Login process completed, isLoading set to false');
    }
  };

  const register = async (email, password, age, gender, goal) => {
    try {
      setIsLoading(true);
      
      // Call the backend API
      const response = await registerAPI(email, password, age, gender, goal);
      
      console.log('🔐 [authContext] Registration successful, token received:', response.token ? 'Yes' : 'No');
      
      // Store the token
      await SecureStore.setItemAsync('authToken', response.token);
      
      // Verify token was stored
      const storedToken = await SecureStore.getItemAsync('authToken');
      console.log('🔐 [authContext] Token stored and retrieved:', storedToken ? 'Yes' : 'No');
      
      // Add a small delay to ensure the token is properly stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get user profile data
      console.log('🔐 [authContext] Calling getUserProfile...');
      const userData = await getUserProfile();
      console.log('🔐 [authContext] User profile retrieved:', userData ? 'Yes' : 'No');
      
      // Store user data
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userData');
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = async (userData) => {
    try {
      // Update stored user data
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      
      // Update user state
      setUser(userData);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

