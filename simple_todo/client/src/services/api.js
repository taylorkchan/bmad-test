import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reduced timeout to 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      console.error(`Server error (${error.response.status}):`, message);
      throw new Error(message);
    } else if (error.request) {
      // Network error - request was made but no response received
      console.error('Network error - no response received:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      });
      throw new Error('Network error - server may be down or unreachable');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error('Request timeout:', error.message);
      throw new Error('Request timeout - server is taking too long to respond');
    } else {
      // Other error
      console.error('Other error:', error.message);
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// API methods
export const medicationsAPI = {
  // Get all medications
  getAll: (userId = 1) => {
    return api.get('/medications', { params: { user_id: userId } });
  },

  // Create new medication
  create: (medicationData) => {
    return api.post('/medications', { ...medicationData, user_id: 1 });
  },

  // Update medication
  update: (id, medicationData) => {
    return api.put(`/medications/${id}`, { ...medicationData, user_id: 1 });
  },

  // Delete medication
  delete: (id) => {
    return api.delete(`/medications/${id}`, { params: { user_id: 1 } });
  },

  // Log medication dose
  logDose: (medicationId, logData) => {
    return api.post(`/medications/${medicationId}/log`, { 
      ...logData, 
      user_id: 1 
    });
  },

  // Get medication logs (history)
  getLogs: (limit = 50) => {
    return api.get('/medications/logs', { 
      params: { user_id: 1, limit } 
    });
  },
};

export const userAPI = {
  // Get user profile
  getProfile: () => {
    return api.get('/users/profile');
  },

  // Get user stats
  getStats: () => {
    return api.get('/users/stats', { params: { user_id: 1 } });
  },
};

// Health check
export const healthCheck = () => {
  return api.get('/health');
};

export default api;