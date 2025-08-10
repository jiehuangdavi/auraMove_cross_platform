// Configuration file for backend connectivity
// Update this IP address to match your computer's local IP address
// You can find your IP by running 'ipconfig' on Windows or 'ifconfig' on Mac/Linux

export const BACKEND_CONFIG = {
  // Replace this with your computer's local IP address
  BASE_URL: 'http://192.168.86.215:5001',
  
  // API endpoints
  AUTH_URL: '/api/auth',
  USER_URL: '/api/user',
  LOGS_URL: '/api/logs',
  CONTENT_URL: '/api/content',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

// Instructions for finding your IP address:
// Windows: Open CMD and type 'ipconfig' - look for "IPv4 Address"
// Mac/Linux: Open Terminal and type 'ifconfig' - look for "inet" followed by your local IP
// Common local IP ranges: 192.168.1.x, 192.168.0.x, 10.0.0.x
