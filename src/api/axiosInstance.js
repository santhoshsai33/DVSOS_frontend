import axios from 'axios';
import { API_BASE } from './endpoints';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || 'Something went wrong';

    if (status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject({ status, message, data: error?.response?.data });
  }
);

export default axiosInstance;
