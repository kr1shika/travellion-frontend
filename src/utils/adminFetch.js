const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const adminFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('adminToken');

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        // Token expired or invalid — force re-login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        window.location.href = '/manage9x7k2/login';
        throw new Error('Session expired. Please log in again.');
    }

    if (response.status === 429) {
        throw new Error('Too many requests. Please slow down.');
    }

    const data = await response.json();
    return { response, data };
};