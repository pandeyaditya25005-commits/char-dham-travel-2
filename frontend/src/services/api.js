import axios from 'axios';
import { API_URL } from '../utils/constants';

console.log("API_URL =", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') window.location.href = '/login';
      }
      error.message = data?.message || 'Something went wrong';
    } else if (error.request) {
      error.message = 'Unable to connect to server. Please try again.';
    }
    return Promise.reject(error);
  }
);

export default api;
