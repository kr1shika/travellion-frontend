// import axios from 'axios';

// const API = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
// });

// export const fetchDestinations = () => API.get('/packages/destinations').then(r => r.data);
// export const fetchActivities   = () => API.get('/packages/activities').then(r => r.data);
// export const fetchPackages     = (params) => API.get('/packages', { params }).then(r => r.data);

const API_URL = "http://localhost:5000/api";

async function getJSON(url) {
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Request failed");
    return json;
}

export async function fetchDestinations() {
    console.log("→ fetchDestinations called");
    const json = await getJSON(`${API_URL}/packages/destinations`);
    console.log("← destinations:", json.data);
    return json.data;
}

export async function fetchActivities() {
    console.log("→ fetchActivities called");
    const json = await getJSON(`${API_URL}/packages/activities`);
    console.log("← activities:", json.data);
    return json.data;
}

export async function fetchPackages({
    destination,
    activity,
    category,
    difficulty,
    minPrice,
    maxPrice,
    duration,
    search,
    sort,
    page = 1,
    limit = 12,
} = {}) {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (destination) params.set("destination", destination);
    if (activity) params.set("activity", activity);
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (duration) params.set("duration", duration);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);

    const json = await getJSON(`${API_URL}/packages?${params.toString()}`);
    return json.data;
}