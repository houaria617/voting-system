import axios from 'axios';

// 1. DYNAMIC URL: Use the environment variable if it exists, otherwise use localhost
// We use import.meta.env because you are using Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API = axios.create({
    // 2. Append '/api' here so it works for both
    baseURL: `${BASE_URL}/api`,
    withCredentials: true
});

// Automatically add token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;