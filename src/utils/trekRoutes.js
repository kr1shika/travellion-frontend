// ============================================
// Trek route data — real altitudes (meters)
// Used by RouteElevation component
// Keyed by destination keyword
// ============================================

export const TREK_ROUTES = {
    "everest base camp": {
        title: "Everest Base Camp",
        stops: [
            { name: "Lukla", altitude: 2840, role: "start" },
            { name: "Phakding", altitude: 2610 },
            { name: "Namche Bazaar", altitude: 3440 },
            { name: "Tengboche", altitude: 3860 },
            { name: "Dingboche", altitude: 4410 },
            { name: "Lobuche", altitude: 4910 },
            { name: "Gorak Shep", altitude: 5190 },
            { name: "Everest Base Camp", altitude: 5364, role: "peak" },
            { name: "Kala Patthar", altitude: 5555, role: "end" },
        ],
    },
    "annapurna base camp": {
        title: "Annapurna Base Camp",
        stops: [
            { name: "Samrung", altitude: 1570, role: "start" },
            { name: "Chhomrong", altitude: 2170 },
            { name: "Bamboo", altitude: 2310 },
            { name: "Deurali", altitude: 3200 },
            { name: "Machhapuchhre BC", altitude: 3700 },
            { name: "Annapurna Base Camp", altitude: 4130, role: "peak" },
            { name: "Jhinu Danda", altitude: 1780, role: "end" },
        ],
    },
    "mardi himal": {
        title: "Mardi Himal",
        stops: [
            { name: "Kande", altitude: 1770, role: "start" },
            { name: "Pothana", altitude: 1990 },
            { name: "Forest Camp", altitude: 2550 },
            { name: "Low Camp", altitude: 3050 },
            { name: "High Camp", altitude: 3580 },
            { name: "Mardi Himal BC", altitude: 4500, role: "peak" },
            { name: "Siding", altitude: 1750, role: "end" },
        ],
    },
    "langtang": {
        title: "Langtang Valley",
        stops: [
            { name: "Syabrubesi", altitude: 1550, role: "start" },
            { name: "Lama Hotel", altitude: 2470 },
            { name: "Ghore Tabela", altitude: 3020 },
            { name: "Langtang Village", altitude: 3430 },
            { name: "Kyanjin Gompa", altitude: 3870, role: "peak" },
            { name: "Kyanjin Ri", altitude: 4773, role: "end" },
        ],
    },
};

// ============================================
// Helper: find the route for a given destination string
// Case-insensitive fuzzy match
// ============================================
export function findTrekRoute(destination) {
    if (!destination) return null;
    const key = String(destination).toLowerCase().trim();

    // Exact match
    if (TREK_ROUTES[key]) return TREK_ROUTES[key];

    // Partial match — package says "Everest Base Camp Trek", key is "everest base camp"
    for (const routeKey of Object.keys(TREK_ROUTES)) {
        if (key.includes(routeKey) || routeKey.includes(key)) {
            return TREK_ROUTES[routeKey];
        }
    }

    return null;
}