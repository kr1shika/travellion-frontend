import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { publicFetch } from "../utils/api";

export default function PackageDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Gallery
    const [activeImage, setActiveImage] = useState(null);

    // ----------------------------------------
    // Fetch package by slug
    // ----------------------------------------
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await publicFetch(`/packages/${slug}`);

                if (!data.success) throw new Error(data.message);

                setPkg(data.data);

                const featured =
                    data.data.images?.find((img) => img.isFeatured) ||
                    data.data.images?.[0];
                setActiveImage(featured?.url || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    // ----------------------------------------
    // Loading / error states
    // ----------------------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <p className="text-gray-500">Loading package...</p>
                </div>
            </div>
        );
    }

    if (error || !pkg) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-[#253564] mb-3">
                        Package not found
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error || "This package may have been removed."}
                    </p>
                    <Link
                        to="/packages"
                        className="inline-block rounded-lg bg-[#cd9d4e] hover:bg-[#b88d3e] text-white font-semibold px-6 py-3"
                    >
                        Browse all packages
                    </Link>
                </div>
            </div>
        );
    }

    const images = pkg.images || [];
    const featuredImage = images.find((img) => img.isFeatured) || images[0];

    // ----------------------------------------
    // Render
    // ----------------------------------------
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* ============================================
                GALLERY
            ============================================ */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                    {/* Breadcrumb */}
                    <div className="text-xs text-gray-500 mb-4">
                        <Link to="/" className="hover:text-[#cd9d4e]">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <Link to="/packages" className="hover:text-[#cd9d4e]">
                            Packages
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700">{pkg.name}</span>
                    </div>

                    {/* Main image + thumbnails */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-3">
                            <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-200">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={pkg.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="lg:col-span-1 grid grid-cols-4 lg:grid-cols-1 gap-3">
                                {images.slice(0, 4).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img.url)}
                                        className={`aspect-[16/10] rounded-lg overflow-hidden border-2 transition ${
                                            activeImage === img.url
                                                ? "border-[#cd9d4e]"
                                                : "border-transparent hover:border-gray-300"
                                        }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt=""
                                            className="w-full h-full object-cover"
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
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="rounded-full bg-[#cd9d4e]/10 text-[#cd9d4e] px-3 py-1 text-xs font-semibold">
                                    {pkg.category}
                                </span>
                                <span className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold">
                                    {pkg.difficulty}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-[#253564]">
                                {pkg.name}
                            </h1>

                            <p className="text-gray-500 mt-2">
                                📍 {pkg.region}, {pkg.country}
                            </p>
                        </div>

                        {/* Quick facts */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Fact label="Duration" value={`${pkg.duration?.days} days`} />
                            <Fact
                                label="Max Altitude"
                                value={
                                    pkg.maxAltitude?.meters
                                        ? `${pkg.maxAltitude.meters} m`
                                        : "—"
                                }
                            />
                            <Fact
                                label="Best Season"
                                value={pkg.seasonDisplay || "—"}
                            />
                            <Fact
                                label="Activity"
                                value={pkg.activity || "—"}
                            />
                        </div>

                        {/* Overview */}
                        {pkg.overview && (
                            <Section title="Overview">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {pkg.overview}
                                </p>
                            </Section>
                        )}

                        {/* Description */}
                        {pkg.description && (
                            <Section title="Description">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {pkg.description}
                                </p>
                            </Section>
                        )}

                        {/* Highlights */}
                        {pkg.highlights?.length > 0 && (
                            <Section title="Highlights">
                                <ul className="space-y-2">
                                    {pkg.highlights.map((h, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 text-gray-700"
                                        >
                                            <span className="text-[#cd9d4e] mt-1">
                                                ✓
                                            </span>
                                            <span>{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}

                        {/* Itinerary */}
                        {pkg.itinerary?.length > 0 && (
                            <Section title="Itinerary">
                                <div className="space-y-4">
                                    {pkg.itinerary.map((day) => (
                                        <div
                                            key={day._id || day.day}
                                            className="bg-gray-50 rounded-lg p-5 border border-gray-100"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 rounded-full bg-[#253564] text-white flex items-center justify-center font-bold text-sm">
                                                        Day {day.day}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-[#253564]">
                                                        {day.title}
                                                    </h4>

                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                                        {day.distance && (
                                                            <span>🥾 {day.distance}</span>
                                                        )}
                                                        {day.altitude?.meters && (
                                                            <span>
                                                                ⛰ {day.altitude.meters} m
                                                            </span>
                                                        )}
                                                        {day.accommodation && (
                                                            <span>
                                                                🏠 {day.accommodation}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-gray-700 mt-3 whitespace-pre-line text-sm leading-relaxed">
                                                        {day.description}
                                                    </p>

                                                    {day.meals && (
                                                        <div className="flex gap-3 text-xs text-gray-500 mt-3">
                                                            {day.meals.breakfast && (
                                                                <span>☕ Breakfast</span>
                                                            )}
                                                            {day.meals.lunch && (
                                                                <span>🍱 Lunch</span>
                                                            )}
                                                            {day.meals.dinner && (
                                                                <span>🍽 Dinner</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Inclusions */}
                        {pkg.inclusions?.length > 0 && (
                            <Section title="What's Included">
                                <div className="space-y-4">
                                    {pkg.inclusions.map((group, i) => (
                                        <div key={i}>
                                            <h4 className="font-semibold text-[#253564] text-sm mb-2">
                                                {group.category}
                                            </h4>
                                            <ul className="space-y-1">
                                                {group.items?.map((item, j) => (
                                                    <li
                                                        key={j}
                                                        className="flex items-start gap-2 text-gray-700 text-sm"
                                                    >
                                                        <span className="text-green-600 mt-0.5">
                                                            ✓
                                                        </span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Exclusions */}
                        {pkg.exclusions?.length > 0 && (
                            <Section title="What's Not Included">
                                <ul className="space-y-1">
                                    {pkg.exclusions.map((ex, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-gray-700 text-sm"
                                        >
                                            <span className="text-red-500 mt-0.5">✕</span>
                                            <span>{ex}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}

                        {/* FAQs */}
                        {pkg.faqs?.length > 0 && (
                            <Section title="Frequently Asked Questions">
                                <div className="space-y-3">
                                    {pkg.faqs.map((faq, i) => (
                                        <details
                                            key={i}
                                            className="bg-gray-50 rounded-lg border border-gray-100"
                                        >
                                            <summary className="cursor-pointer p-4 font-semibold text-[#253564] text-sm">
                                                {faq.question}
                                            </summary>
                                            <p className="px-4 pb-4 text-gray-700 text-sm whitespace-pre-line">
                                                {faq.answer}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </Section>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Booking card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                <p className="text-sm text-gray-500">From</p>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-bold text-[#253564]">
                                        ${pkg.price?.usd}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        / person
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mb-5">
                                    <div className="flex justify-between">
                                        <span>Duration</span>
                                        <span className="font-medium text-gray-900">
                                            {pkg.duration?.days} days
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Difficulty</span>
                                        <span className="font-medium text-gray-900">
                                            {pkg.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Group Size</span>
                                        <span className="font-medium text-gray-900">
                                            {pkg.minGroupSize}–{pkg.maxGroupSize}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate(`/packages/${pkg.slug}/book`)
                                    }
                                    className="w-full rounded-lg bg-[#cd9d4e] hover:bg-[#b88d3e] text-white font-semibold py-3.5 transition"
                                >
                                    Book This Trek
                                </button>

                                <Link
                                    to="/contact"
                                    className="mt-3 block w-full text-center rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Ask a Question
                                </Link>
                            </div>

                            {/* Need help */}
                            <div className="bg-[#253564] rounded-lg p-6 text-white">
                                <h3 className="font-bold mb-2">Need help?</h3>
                                <p className="text-sm text-white/80 mb-4">
                                    Our travel experts are here to help you plan the
                                    perfect trek.
                                </p>
                                <p className="text-sm">
                                    📞 +977 1234567890
                                </p>
                                <p className="text-sm">
                                    ✉ info@trektravel.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ----------------------------------------
// Subcomponents
// ----------------------------------------
function Section({ title, children }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#253564] mb-4">
                {title}
            </h2>
            {children}
        </div>
    );
}

function Fact({ label, value }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="font-semibold text-[#253564] text-sm">
                {value || "—"}
            </p>
        </div>
    );
}