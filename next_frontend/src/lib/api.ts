import axios from 'axios';

/**
 * Pre-configured Axios instance for the Express backend.
 * The baseURL reads from the environment variable set in .env.local,
 * with a safe fallback for development.
 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Sends cookies (useful for JWT in httpOnly cookies)
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Attach the auth token from localStorage (if using token-based auth)
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// Global error handling (e.g. redirect on 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized — e.g., clear token and redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
