import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  let url = envUrl || 'http://localhost:8000/api';
  
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.replace(/\/+$/, '') + '/api';
  }
  
  // Helpful logging for debugging production connectivity
  if (import.meta.env.MODE === 'production') {
    console.log('Production API URL:', url);
    if (!envUrl) {
      console.warn('VITE_API_URL is NOT set! Defaulting to localhost, which will fail in production.');
    }
  }
  
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
