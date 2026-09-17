const API_URL = "http://localhost:5000/api";

export const adminFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(options.body instanceof FormData
                ? {}
                : { "Content-Type": "application/json" }),
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
    }

    return { response, data };
};