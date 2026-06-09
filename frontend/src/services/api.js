import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const basicAuth = localStorage.getItem('basicAuth');
  if (basicAuth) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Basic ${basicAuth}`;
  }
  return config;
});

export default api;
