import { useMemo, useState } from "react";

/*
 * EverestRouteProfile
 *
 * Shows the mountain/elevation profile only for Everest Base Camp packages.
 *
 * Usage:
 *   <EverestRouteProfile packageData={pkg} />
 *
 * The component uses the package itinerary elevations when available.
 * If the itinerary does not contain enough elevation data, it falls back
 * to the standard EBC route stops.
 */

const EBC_FALLBACK_STOPS = [
    { id: "lukla", day: 1, name: "Lukla", altitude: 2860 },
    { id: "phakding", day: 1, name: "Phakding", altitude: 2610 },
    { id: "namche", day: 2, name: "Namche Bazaar", altitude: 3440 },
    { id: "tengboche", day: 3, name: "Tengboche", altitude: 3860 },
    { id: "dingboche", day: 4, name: "Dingboche", altitude: 4410 },
    { id: "lobuche", day: 5, name: "Lobuche", altitude: 4940 },
    { id: "gorak-shep", day: 6, name: "Gorak Shep", altitude: 5164 },
    {
        id: "everest-base-camp",
        day: 6,
        name: "Everest Base Camp",
        altitude: 5364,
    },
];

const EBC_FALLBACK_ELEVATIONS = {
    lukla: 2860,
    phakding: 2610,
    namche: 3440,
    "namche bazaar": 3440,
    tengboche: 3860,
    "tengboche monastery": 3860,
    dingboche: 4410,
    lobuche: 4940,
    "gorak shep": 5164,
    "everest base camp": 5364,
};

function isEverestBaseCampPackage(packageData) {
    const value = `${packageData?.slug || ""} ${packageData?.name || ""}`.toLowerCase();

    return (
        value.includes("everest-base-camp") ||
        value.includes("everest base camp")
    );
}

function getFallbackAltitude(title = "") {
    const normalized = title
        .toLowerCase()
        .replace(/[–—-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    for (const [place, altitude] of Object.entries(EBC_FALLBACK_ELEVATIONS)) {
        if (normalized.includes(place)) {
            return altitude;
        }
    }

    return null;
}

function getItineraryStops(itinerary = []) {
    return itinerary
        .map((day, index) => {
            const name =
                day?.title ||
                day?.location ||
                day?.name ||
                `Day ${day?.day || index + 1}`;

            const altitude =
                Number(day?.altitude?.meters) ||
                Number(day?.altitudeMeters) ||
                getFallbackAltitude(name);

            if (!altitude) return null;

            return {
                id: day?.id || `${day?.day || index + 1}-${name}`,
                day: day?.day || index + 1,
                name,
                altitude,
            };
        })
        .filter(Boolean);
}

function getRouteStops(itinerary) {
    const itineraryStops = getItineraryStops(itinerary);

    return itineraryStops.length >= 2
        ? itineraryStops
        : EBC_FALLBACK_STOPS;
}

export default function EverestRouteProfile({ packageData }) {
    const [hoveredStop, setHoveredStop] = useState(null);

    const routeStops = useMemo(
        () => getRouteStops(packageData?.itinerary),
        [packageData?.itinerary]
    );

    if (!isEverestBaseCampPackage(packageData)) {
        return null;
    }

    const width = 1200;
    const height = 320;
    const bottom = 282;
    const sidePadding = 34;
    const usableWidth = width - sidePadding * 2;

    const minAltitude = Math.min(...routeStops.map((stop) => stop.altitude));
    const maxAltitude = Math.max(...routeStops.map((stop) => stop.altitude));
    const altitudeRange = Math.max(maxAltitude - minAltitude, 1);

    const points = routeStops.map((stop, index) => {
        const x =
            routeStops.length === 1
                ? width / 2
                : sidePadding +
                  (index / (routeStops.length - 1)) * usableWidth;

        // Higher altitude = higher point in the profile.
        const y =
            bottom -
            38 -
            ((stop.altitude - minAltitude) / altitudeRange) * 150;

        return {
            ...stop,
            x,
            y,
        };
    });

    // Build a smooth elevation line.
    const linePath = points.reduce((path, point, index) => {
        if (index === 0) {
            return `M ${point.x} ${point.y}`;
        }

        const previous = points[index - 1];
        const midX = (previous.x + point.x) / 2;
        const midY = (previous.y + point.y) / 2;

        return `${path} Q ${previous.x} ${previous.y} ${midX} ${midY}`;
    }, "");

    const last = points[points.length - 1];

    const mountainPath = `${linePath}
        Q ${last.x} ${last.y} ${last.x} ${last.y}
        L ${last.x} ${bottom}
        L ${points[0].x} ${bottom}
        Z`;

    return (
        <section className="relative z-20 -mt-20 md:-mt-28 overflow-visible">
            <div className="relative h-[300px] w-full">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    role="img"
                    aria-label="Everest Base Camp route elevation profile"
                >
                    {/* White mountain-shaped section */}
                    <path
                        d={mountainPath}
                        fill="white"
                        stroke="white"
                        strokeWidth="2"
                    />

                    {/* Route stops */}
                    {points.map((point) => {
                        const isEbc = point.name
                            .toLowerCase()
                            .includes("everest base camp");

                        const tooltipWidth = 178;
                        const tooltipHeight = 54;

                        const tooltipX = Math.max(
                            8,
                            Math.min(
                                point.x - tooltipWidth / 2,
                                width - tooltipWidth - 8
                            )
                        );

                        const tooltipY = Math.max(
                            8,
                            point.y - tooltipHeight - 18
                        );

                        return (
                            <g
                                key={point.id}
                                className="cursor-pointer"
                                onMouseEnter={() =>
                                    setHoveredStop(point.id)
                                }
                                onMouseLeave={() => setHoveredStop(null)}
                            >
                                {/* Vertical marker line */}
                                <line
                                    x1={point.x}
                                    x2={point.x}
                                    y1={point.y}
                                    y2={point.y + 34}
                                    stroke="#253564"
                                    strokeWidth="2"
                                    opacity="0.55"
                                />

                                {/* Larger invisible hover target */}
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="20"
                                    fill="transparent"
                                />

                                {/* Marker */}
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="7"
                                    fill={isEbc ? "#cd9d4e" : "white"}
                                    stroke="#253564"
                                    strokeWidth="3"
                                />

                                {/* Tooltip */}
                                {hoveredStop === point.id && (
                                    <g pointerEvents="none">
                                        <rect
                                            x={tooltipX}
                                            y={tooltipY}
                                            width={tooltipWidth}
                                            height={tooltipHeight}
                                            rx="9"
                                            fill="#253564"
                                            opacity="0.98"
                                        />

                                        <text
                                            x={tooltipX + tooltipWidth / 2}
                                            y={tooltipY + 22}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="14"
                                            fontWeight="600"
                                        >
                                            {point.name.length > 25
                                                ? `${point.name.slice(0, 25)}…`
                                                : point.name}
                                        </text>

                                        <text
                                            x={tooltipX + tooltipWidth / 2}
                                            y={tooltipY + 42}
                                            textAnchor="middle"
                                            fill="#f3d7a3"
                                            fontSize="12"
                                        >
                                            {point.altitude.toLocaleString()} m
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                <div className="absolute left-6 bottom-4 text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400">
                    Route elevation
                </div>

                <div className="absolute right-6 bottom-4 text-[10px] md:text-xs text-gray-400">
                    Hover a stop
                </div>
            </div>
        </section>
    );
}
