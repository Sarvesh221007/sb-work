import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sb-backend.onrender.com/api', // ← use actual backend Render URL
  withCredentials: true,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
