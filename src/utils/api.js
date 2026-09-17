const API_URL = "http://localhost:5000/api";

export const publicFetch = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();
    return { response, data };
};