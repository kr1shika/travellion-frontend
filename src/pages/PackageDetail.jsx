import { useEffect, useState } from "react";

import {
    Calendar,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Coffee,
    Compass,
    Footprints,
    Home,
    Mail,
    MapPin,
    Moon,
    Mountain,
    Phone,
    Users,
    Utensils,
    X,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { publicFetch } from "../utils/api";

// ============================================
// Normalizer
// ============================================
function normalizePackage(pkg) {
    if (!pkg || typeof pkg !== "object") return null;

    const toBool = (v) =>
        v === true || v === 1 || v === "true";

    return {
        ...pkg,

        price: {
            usd: pkg.priceUsd ?? null,
            npr: pkg.priceNpr ?? null,
        },

        duration: {
            days: pkg.durationDays ?? null,
            nights: pkg.durationNights ?? null,
        },

        maxAltitude: {
            meters: pkg.maxAltitudeMeters ?? null,
            feet: pkg.maxAltitudeFeet ?? null,
        },

        images: Array.isArray(pkg.images)
            ? pkg.images
            : [],

        itinerary: Array.isArray(pkg.itinerary)
            ? pkg.itinerary.map((it) => ({
                ...it,

                altitude: {
                    meters: it.altitudeMeters ?? null,
                    feet: it.altitudeFeet ?? null,
                },

                meals: {
                    breakfast: toBool(
                        it.mealsBreakfast
                    ),
                    lunch: toBool(it.mealsLunch),
                    dinner: toBool(it.mealsDinner),
                },
            }))
            : [],

        highlights: Array.isArray(pkg.highlights)
            ? pkg.highlights
            : [],

        exclusions: Array.isArray(pkg.exclusions)
            ? pkg.exclusions
            : [],


        included: Array.isArray(pkg.included) ? pkg.included : [],
        faqs: Array.isArray(pkg.faqs)
            ? pkg.faqs
            : [],
    };
}

export default function PackageDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImage, setActiveImage] = useState(null);

    // ============================================
    // Fetch package
    // ============================================
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await publicFetch(
                    `/packages/${slug}`
                );

                if (!data?.success) {
                    throw new Error(
                        data?.message || "Package not found"
                    );
                }

                if (!data.data) {
                    throw new Error(
                        "Package data is empty"
                    );
                }

                const normalized = normalizePackage(
                    data.data
                );

                if (!normalized) {
                    throw new Error(
                        "Could not parse package data"
                    );
                }

                if (cancelled) return;

                setPkg(normalized);

                const featured =
                    normalized.images.find(
                        (img) => img.isFeatured
                    ) || normalized.images[0];

                setActiveImage(
                    featured?.url || null
                );
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    // ============================================
    // Loading
    // ============================================
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef]">
                <Header />

                <div className="max-w-7xl mx-auto px-6 py-32">
                    <div className="h-5 w-40 bg-[#e9e5d9] rounded animate-pulse" />
                    <div className="mt-5 h-8 w-72 bg-[#e9e5d9] rounded animate-pulse" />
                </div>
            </div>
        );
    }

    // ============================================
    // Error
    // ============================================
    if (error || !pkg) {
        return (
            <div className="min-h-screen bg-[#f7f5ef]">
                <Header />

                <div className="max-w-2xl mx-auto px-6 py-32 text-center">
                    <p className="text-[#c99b52] uppercase tracking-[0.2em] text-xs font-semibold mb-4">
                        Sorry
                    </p>

                    <h1 className="font-serif text-3xl md:text-4xl text-[#101d30] mb-4">
                        Package not found
                    </h1>

                    <p className="text-[#18243a]/55 mb-8">
                        {error ||
                            "This package may have been removed."}
                    </p>

                    <Link
                        to="/packages"
                        className="inline-flex rounded-xl bg-[#c99b52] hover:bg-[#b88d45] text-white font-semibold px-6 py-3 transition-colors"
                    >
                        Browse all packages
                    </Link>
                </div>
            </div>
        );
    }

    // ============================================
    // Package data
    // ============================================
    const images = pkg.images;

    const facts = [
        pkg.duration?.days && {
            label: "Duration",
            value: `${pkg.duration.days} days`,
            icon: (
                <Clock className="w-4 h-4 text-[#c99b52]" />
            ),
        },

        pkg.maxAltitude?.meters && {
            label: "Max Altitude",
            value: `${pkg.maxAltitude.meters} m`,
            icon: (
                <Mountain className="w-4 h-4 text-[#c99b52]" />
            ),
        },

        pkg.seasonDisplay && {
            label: "Best Season",
            value: pkg.seasonDisplay,
            icon: (
                <Calendar className="w-4 h-4 text-[#c99b52]" />
            ),
        },

        pkg.activity && {
            label: "Activity",
            value: pkg.activity,
            icon: (
                <Compass className="w-4 h-4 text-[#c99b52]" />
            ),
        },
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-[#f7f5ef] text-[#18243a]">
            <Header />

            {/* ============================================
                GALLERY
            ============================================ */}
            <section className="bg-[#f7f5ef]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-3">

                    {/* Breadcrumb */}
                    <div className="text-xs text-[#18243a]/45 mb-5 flex items-center gap-2">
                        <Link
                            to="/"
                            className="hover:text-[#c99b52] transition-colors"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <Link
                            to="/packages"
                            className="hover:text-[#c99b52] transition-colors"
                        >
                            Packages
                        </Link>

                        <span>/</span>

                        <span className="text-[#18243a]/65 truncate">
                            {pkg.name}
                        </span>
                    </div>

                    {/* Gallery */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-3">
                            <div className="aspect-[16/9] rounded-[1.75rem] overflow-hidden bg-[#e9e5d9]">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={pkg.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#18243a]/30">
                                        No image
                                    </div>
                                )}
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="lg:col-span-1 grid grid-cols-4 lg:grid-cols-1 gap-3">
                                {images
                                    .slice(0, 4)
                                    .map((img, i) => (
                                        <button
                                            key={
                                                img.id || i
                                            }
                                            onClick={() =>
                                                setActiveImage(
                                                    img.url
                                                )
                                            }
                                            className={`aspect-[16/9] rounded-2xl overflow-hidden border-2 transition-all ${activeImage ===
                                                img.url
                                                ? "border-[#c99b52]"
                                                : "border-transparent hover:border-[#18243a]/20"
                                                }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt=""
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ============================================
                MAIN CONTENT
            ============================================ */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* =====================================
                        LEFT COLUMN
                    ===================================== */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Header */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {pkg.category && (
                                    <span className="rounded-full bg-[#c99b52]/10 text-[#b18442] px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-semibold">
                                        {pkg.category}
                                    </span>
                                )}

                                {pkg.difficulty && (
                                    <span className="rounded-full bg-[#101d30]/7 text-[#18243a]/65 px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-semibold">
                                        {pkg.difficulty}
                                    </span>
                                )}
                            </div>

                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#101d30]">
                                {pkg.name}
                            </h1>

                            {pkg.region && (
                                <p className="text-[#18243a]/50 mt-4 inline-flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-[#c99b52]" />
                                    {pkg.region}, Nepal
                                </p>
                            )}
                        </div>

                        {/* Quick Facts */}
                        {facts.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {facts.map((f, i) => (
                                    <Fact
                                        key={i}
                                        label={f.label}
                                        value={f.value}
                                        icon={f.icon}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Overview */}
                        {pkg.overview?.trim() && (
                            <Section title="Overview">
                                <p className="text-[#18243a]/70 leading-relaxed whitespace-pre-line">
                                    {pkg.overview}
                                </p>
                            </Section>
                        )}

                        {/* Description */}
                        {pkg.description?.trim() && (
                            <Section title="The Journey">
                                <p className="text-[#18243a]/70 leading-relaxed whitespace-pre-line">
                                    {pkg.description}
                                </p>
                            </Section>
                        )}

                        {/* Highlights */}
                        {pkg.highlights.length > 0 && (
                            <Section title="Highlights">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {pkg.highlights.map(
                                        (h, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-3 text-[#18243a]/70"
                                            >
                                                <span className="mt-0.5 w-5 h-5 rounded-full bg-[#c99b52]/10 flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-3 h-3 text-[#c99b52]" />
                                                </span>

                                                <span>
                                                    {h}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </Section>
                        )}

                        {/* ============================================
    ITINERARY
============================================ */}
                        {pkg.itinerary.length > 0 && (
                            <ItineraryCard itinerary={pkg.itinerary} />
                        )}
                        {/* Simple included list */}
                        {pkg.included?.length > 0 && (
                            <Section title="What's Included">
                                <ul className="space-y-1">
                                    {pkg.included.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-gray-700 text-sm"
                                        >
                                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}

                        {/* Inclusions */}
                        {/* {pkg.included?.length > 0 && (
                            <Section title="What's Included">
                                <div className="space-y-5">
                                    {pkg.included.map(
                                        (group, i) => (
                                            <div key={i}>
                                                {group.category && (
                                                    <h4 className="font-semibold text-[#101d30] text-sm mb-3">
                                                        {
                                                            group.category
                                                        }
                                                    </h4>
                                                )}

                                                <ul className="space-y-2">
                                                    {group.items?.map(
                                                        (
                                                            item,
                                                            j
                                                        ) => (
                                                            <li
                                                                key={
                                                                    j
                                                                }
                                                                className="flex items-start gap-2 text-[#18243a]/70 text-sm"
                                                            >
                                                                <Check className="w-4 h-4 text-[#c99b52] mt-0.5 flex-shrink-0" />
                                                                <span>
                                                                    {
                                                                        item
                                                                    }
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )
                                    )}
                                </div>
                            </Section>
                        )} */}

                        {/* Exclusions */}
                        {pkg.exclusions.length > 0 && (
                            <Section title="What's Not Included">
                                <ul className="space-y-2">
                                    {pkg.exclusions.map(
                                        (ex, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2 text-[#18243a]/70 text-sm"
                                            >
                                                <X className="w-4 h-4 text-[#9b665c] mt-0.5 flex-shrink-0" />
                                                <span>
                                                    {ex}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </Section>
                        )}

                        {/* FAQs */}
                        {pkg.faqs.length > 0 && (
                            <Section title="Frequently Asked Questions">
                                <div className="space-y-3">
                                    {pkg.faqs.map(
                                        (faq, i) => (
                                            <details
                                                key={i}
                                                className="bg-[#faf9f5] rounded-xl border border-[#18243a]/8 overflow-hidden"
                                            >
                                                <summary className="cursor-pointer p-4 font-semibold text-[#101d30] text-sm hover:text-[#c99b52] transition-colors">
                                                    {
                                                        faq.question
                                                    }
                                                </summary>

                                                <p className="px-4 pb-5 text-[#18243a]/65 text-sm leading-relaxed whitespace-pre-line">
                                                    {
                                                        faq.answer
                                                    }
                                                </p>
                                            </details>
                                        )
                                    )}
                                </div>
                            </Section>
                        )}
                    </div>

                    {/* =====================================
                        RIGHT SIDEBAR
                    ===================================== */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-4">

                            {/* Booking Card */}
                            <div className="bg-white rounded-[1.75rem] border border-[#18243a]/10 p-6 lg:p-7 shadow-sm">
                                {pkg.price?.usd && (
                                    <>
                                        <p className="text-[11px] uppercase tracking-[0.15em] text-[#18243a]/40 mb-1">
                                            From
                                        </p>

                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="font-serif text-4xl text-[#101d30]">
                                                $
                                                {
                                                    pkg
                                                        .price
                                                        .usd
                                                }
                                            </span>

                                            <span className="text-[#18243a]/45 text-sm">
                                                / person
                                            </span>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-3 text-sm text-[#18243a]/60 mb-6">
                                    {pkg.duration?.days && (
                                        <SidebarFact
                                            icon={
                                                <Clock />
                                            }
                                            label="Duration"
                                            value={`${pkg.duration.days} days`}
                                        />
                                    )}

                                    {pkg.difficulty && (
                                        <SidebarFact
                                            icon={
                                                <Compass />
                                            }
                                            label="Difficulty"
                                            value={
                                                pkg.difficulty
                                            }
                                        />
                                    )}

                                    {pkg.minGroupSize &&
                                        pkg.maxGroupSize && (
                                            <SidebarFact
                                                icon={
                                                    <Users />
                                                }
                                                label="Group Size"
                                                value={`${pkg.minGroupSize}–${pkg.maxGroupSize}`}
                                            />
                                        )}
                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/packages/${pkg.slug}/booking-request`
                                        )
                                    }
                                    className="w-full rounded-xl bg-[#c99b52] hover:bg-[#b88d45] text-white font-semibold py-3.5 transition-all duration-300 hover:shadow-md"
                                >
                                    Request Booking
                                </button>

                                <Link
                                    to="/contact"
                                    className="mt-3 block w-full text-center rounded-xl border border-[#18243a]/15 py-3 text-sm font-semibold text-[#18243a]/70 hover:bg-[#f7f5ef] hover:border-[#18243a]/25 transition-colors"
                                >
                                    Ask a Question
                                </Link>
                            </div>

                            {/* Help Card */}
                            <div className="bg-[#101d30] rounded-[1.75rem] p-6 lg:p-7 text-white">
                                <p className="text-[#d6aa63] uppercase tracking-[0.18em] text-[10px] font-semibold mb-3">
                                    Need help?
                                </p>

                                <h3 className="font-serif text-2xl mb-3">
                                    Planning your
                                    <br />
                                    <span className="italic">
                                        journey?
                                    </span>
                                </h3>

                                <p className="text-sm text-white/55 leading-relaxed mb-5">
                                    Our travel experts are here to
                                    help you plan the right trek
                                    for you.
                                </p>

                                <div className="space-y-2 text-sm text-white/75">
                                    <p className="inline-flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-[#d6aa63]" />
                                        +977 9843120192
                                    </p>

                                    <p className="inline-flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-[#d6aa63]" />
                                        info@travelionadventures.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// ============================================
// SECTION
// ============================================
function Section({ title, children }) {
    return (
        <div className="bg-white rounded-[1.5rem] border border-[#18243a]/8 p-6 sm:p-7">
            <h2 className="font-serif text-2xl text-[#101d30] mb-5">
                {title}
            </h2>

            {children}
        </div>
    );
}

// ============================================
// FACT
// ============================================
function Fact({ label, value, icon }) {
    return (
        <div className="bg-white rounded-2xl border border-[#18243a]/8 p-4">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#18243a]/40 mb-2 inline-flex items-center gap-1.5">
                {icon}
                {label}
            </p>

            <p className="font-semibold text-[#101d30] text-sm">
                {value}
            </p>
        </div>
    );
}

// ============================================
// SIDEBAR FACT
// ============================================
function SidebarFact({ icon, label, value }) {
    return (
        <div className="flex justify-between items-center gap-4">
            <span className="inline-flex items-center gap-2">
                <span className="text-[#c99b52] [&>svg]:w-4 [&>svg]:h-4">
                    {icon}
                </span>

                {label}
            </span>

            <span className="font-medium text-[#101d30]">
                {value}
            </span>
        </div>
    );
}


// ============================================
// ITINERARY CARD
// Adapts to two content styles:
//   - Multi-day trek: "Day 1: Arrival in Kathmandu"
//   - Schedule / heli tour: "5:30 – 5:50 am: Hotel pickup"
// ============================================
function ItineraryCard({ itinerary }) {
    const PREVIEW_COUNT = 5;
    const [showAll, setShowAll] = useState(false);

    const visible = showAll
        ? itinerary
        : itinerary.slice(0, PREVIEW_COUNT);

    const hasMore = itinerary.length > PREVIEW_COUNT;
    const hiddenCount = itinerary.length - PREVIEW_COUNT;

    // Detect if the itinerary is schedule-style (every entry starts with a time)
    const isScheduleStyle = itinerary.every((d) =>
        /^\d{1,2}[:.]\d{2}/.test((d.title || "").trim())
    );

    return (
        <div className="bg-white rounded-[1.5rem] border border-[#18243a]/8 p-6 sm:p-7">
            {/* Header row */}
            <div className="flex items-center justify-between mb-5 gap-4">
                <h2 className="font-serif text-2xl text-[#101d30] flex items-baseline gap-3">
                    Itinerary
                    {isScheduleStyle && (
                        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#b18442]">
                            · Schedule
                        </span>
                    )}
                </h2>

                {hasMore && (
                    <button
                        type="button"
                        onClick={() => setShowAll((s) => !s)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b18442] hover:text-[#c99b52] transition-colors flex-shrink-0"
                    >
                        {showAll ? (
                            <>
                                Show less
                                <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                View all {itinerary.length}{" "}
                                {isScheduleStyle ? "stops" : "days"}
                                <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Days / Stops */}
            <div className="divide-y divide-[#18243a]/8">
                {visible.map((entry, idx) => {
                    const title = (entry.title || "").trim();

                    // Extract "05:30 – 05:50 am" from the start of title if present
                    const timeMatch = title.match(
                        /^(\d{1,2}[:.]\d{2}(?:\s*(?:am|pm))?)\s*[-–—]\s*(\d{1,2}[:.]\d{2}(?:\s*(?:am|pm))?)(.*)$/i
                    );

                    // A single time like "05:30 am: Something"
                    const singleTimeMatch = title.match(
                        /^(\d{1,2}[:.]\d{2}\s*(?:am|pm)?)\s*[:·-]\s*(.*)$/i
                    );

                    const timeRange = timeMatch
                        ? `${timeMatch[1].trim()} – ${timeMatch[2].trim()}`
                        : singleTimeMatch
                            ? singleTimeMatch[1].trim()
                            : null;

                    const titleRest = timeMatch
                        ? timeMatch[3].replace(/^[\s:·-]+/, "").trim()
                        : singleTimeMatch
                            ? singleTimeMatch[2].trim()
                            : title;

                    const meta = [
                        entry.distance && {
                            icon: /min|hour|hr/i.test(entry.distance) ? (
                                <Clock className="w-3.5 h-3.5" />
                            ) : (
                                <Footprints className="w-3.5 h-3.5" />
                            ),
                            text: entry.distance,
                        },
                        entry.altitude?.meters && {
                            icon: <Mountain className="w-3.5 h-3.5" />,
                            text: `${entry.altitude.meters} m`,
                        },
                        entry.accommodation && {
                            icon: <Home className="w-3.5 h-3.5" />,
                            text: entry.accommodation,
                        },
                    ].filter(Boolean);

                    const meals = [
                        entry.meals?.breakfast && {
                            icon: <Coffee className="w-3.5 h-3.5" />,
                            text: "Breakfast",
                        },
                        entry.meals?.lunch && {
                            icon: <Utensils className="w-3.5 h-3.5" />,
                            text: "Lunch",
                        },
                        entry.meals?.dinner && {
                            icon: <Moon className="w-3.5 h-3.5" />,
                            text: "Dinner",
                        },
                    ].filter(Boolean);

                    return (
                        <details
                            key={entry.id || entry.day}
                            open={idx === 0}
                            className="group"
                        >
                            <summary className="flex items-center gap-4 cursor-pointer list-none py-4 px-1 hover:bg-[#faf9f5] rounded-lg transition-colors">
                                {/* Left badge — clock for schedule, number for trek */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#c99b52]/10 flex items-center justify-center">
                                    {timeRange ? (
                                        <Clock className="w-5 h-5 text-[#b18442]" />
                                    ) : (
                                        <span className="font-serif text-lg text-[#b18442] leading-none">
                                            {String(entry.day).padStart(2, "0")}
                                        </span>
                                    )}
                                </div>

                                {/* Title + meta */}
                                <div className="flex-1 min-w-0">
                                    {/* Time pill (only for schedule entries) */}
                                    {timeRange && (
                                        <span className="inline-block text-[10px] uppercase tracking-[0.15em] font-semibold text-[#b18442] bg-[#c99b52]/8 px-2 py-0.5 rounded mb-1">
                                            {timeRange}
                                        </span>
                                    )}

                                    <p className="font-serif text-lg text-[#101d30] leading-snug">
                                        {titleRest || title}
                                    </p>

                                    {meta.length > 0 && (
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#18243a]/50 mt-1.5 [&>span>svg]:text-[#c99b52]/70">
                                            {meta.map((m, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1.5"
                                                >
                                                    {m.icon}
                                                    {m.text}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <ChevronDown className="w-5 h-5 text-[#18243a]/40 flex-shrink-0 transition-transform duration-200 group-open:rotate-180" />
                            </summary>

                            <div className="pl-16 pr-2 pb-5 pt-1">
                                {entry.description && (
                                    <p className="text-[#18243a]/70 whitespace-pre-line text-sm leading-relaxed">
                                        {entry.description}
                                    </p>
                                )}

                                {meals.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#18243a]/55 mt-4 pt-4 border-t border-[#18243a]/8">
                                        <span className="uppercase tracking-[0.12em] text-[10px] font-semibold text-[#b18442]">
                                            Meals
                                        </span>
                                        {meals.map((m, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1.5 [&>svg]:text-[#c99b52]/70"
                                            >
                                                {m.icon}
                                                {m.text}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </details>
                    );
                })}
            </div>

            {/* Bottom hint when collapsed */}
            {hasMore && !showAll && (
                <p className="text-xs text-[#18243a]/40 mt-4 text-center">
                    {hiddenCount} more{" "}
                    {isScheduleStyle ? "stop" : "day"}
                    {hiddenCount !== 1 && "s"} hidden
                </p>
            )}
        </div>
    );
}