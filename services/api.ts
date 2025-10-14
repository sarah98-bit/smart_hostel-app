import axios from 'axios';

// 🔐 Change this URL to match your backend
export const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🧑 Login user
export const loginUser = (data: { email: string; password: string }) => {
  return api.post('/auth/login', data);
};

// 🆕 Register user
export const registerUser = (data: { username: string; email: string; password: string; role: string }) => {
  return api.post('/auth/register', data);
};

// 🔁 Forgot password
export const forgotPassword = (data: { email: string }) => {
  return api.post('/auth/forgot-password', data);
};

export default api;
