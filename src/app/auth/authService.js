import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from './config';

// Use the configuration file for API URL
const API_URL = getApiUrl('/api/auth');

console.log('🔐 [authService] API_URL constructed as:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

console.log('🔐 [authService] Axios client created with baseURL:', apiClient.defaults.baseURL);

// Test the URL construction
console.log('🔐 [authService] Test URL construction - baseURL + /register:', `${apiClient.defaults.baseURL}/register`);
console.log('🔐 [authService] Test URL construction - baseURL + /login:', `${apiClient.defaults.baseURL}/login`);

// Test the actual axios URL construction
const testUrl = new URL('/register', apiClient.defaults.baseURL);
console.log('🔐 [authService] Test URL construction with URL constructor:', testUrl.toString());

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    console.log('🔐 [authService] Request interceptor - URL:', config.url);
    console.log('🔐 [authService] Request interceptor - Method:', config.method);
    console.log('🔐 [authService] Request interceptor - Data:', config.data);
    console.log('🔐 [authService] Request interceptor - Full URL:', `${config.baseURL}${config.url}`);
    
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 [authService] Added Authorization header with token');
    } else {
      console.log('🔐 [authService] No token found in SecureStore');
    }
    
    console.log('🔐 [authService] Final headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('🔐 [authService] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('🔐 [authService] Response interceptor - Success:', response.status, response.data);
    return response;
  },
  (error) => {
    console.log('🔐 [authService] Response interceptor - Error:', error.response?.status, error.response?.data);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.msg || 'Invalid request data');
        case 401:
          throw new Error('Invalid credentials');
        case 403:
          throw new Error('Access denied');
        case 404:
          throw new Error('Service not found');
        case 422:
          throw new Error(data.msg || 'Validation failed');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.msg || 'An unexpected error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An error occurred while setting up the request.');
    }
  }
);

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  } catch (error) {
    // Error is already handled by interceptor
    throw error;
  }
};

export const register = async (email, password, age, gender, goal) => {
  try {
    console.log('🔐 [authService] Register request:', { email, age, gender, goal });
    console.log('🔐 [authService] API_URL:', API_URL);
    console.log('🔐 [authService] Making POST request to:', `${API_URL}/register`);
    
    // Test the actual URL construction
    const testUrl = new URL('/register', apiClient.defaults.baseURL);
    console.log('🔐 [authService] Test URL construction in register:', testUrl.toString());
    
    // Temporarily bypass the configured apiClient to test if interceptor is the issue
    const response = await axios.post(`${API_URL}/register`, { 
      email, 
      password, 
      age, 
      gender, 
      goal 
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('🔐 [authService] Register response:', response.data);
    return response.data;
  } catch (error) {
    console.error('🔐 [authService] Register error:', error);
    console.error('🔐 [authService] Error response:', error.response?.data);
    console.error('🔐 [authService] Error status:', error.response?.status);
    // Error is already handled by interceptor
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateToken = async (token) => {
  try {
    const response = await apiClient.get('/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await apiClient.post('/refresh', { refreshToken });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};


