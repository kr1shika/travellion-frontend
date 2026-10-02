import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { publicFetch } from "../utils/api";

export default function Packages() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";
    const duration = searchParams.get("duration") || "";
    const price = searchParams.get("price") || "";

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                params.set("limit", "24");

                if (category) params.set("category", category);
                if (sort) params.set("sort", sort);
                if (duration) params.set("duration", duration);
                if (price) params.set("price", price);

                const { data } = await publicFetch(
                    `/packages?${params.toString()}`
                );

                if (data.success) {
                    setPackages(data.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [category, sort, duration, price]);

    const updateFilter = (key, value) => {
        const next = new URLSearchParams(searchParams);

        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }

        setSearchParams(next);
    };

    const clearFilters = () => {
        const next = new URLSearchParams(searchParams);
        next.delete("duration");
        next.delete("price");
        setSearchParams(next);
    };

    return (
        <div className="min-h-screen bg-[#f7f5ef] text-[#18243a]">
            <Header />

            {/* ============================================
                CONTENT
            ============================================ */}
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-34 lg:py-30">
                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-14">
                    {/* ====================================
                        LEFT FILTER SIDEBAR
                    ==================================== */}
                    <aside>
                        <div className="lg:sticky lg:top-28">
                            <div className="flex items-center justify-between mb-7">
                                <div>
                                    <p className="text-[#c99b52] uppercase tracking-[0.2em] text-[10px] font-semibold mb-1">
                                        Refine
                                    </p>

                                    <h2 className="font-serif text-2xl text-[#101d30]">
                                        Filters
                                    </h2>
                                </div>

                                {(duration || price || category || sort) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Wipe every filter — keep only the path
                                            setSearchParams({});
                                        }}
                                        className="text-xs font-semibold text-[#c99b52] hover:text-[#a97f3d] transition-colors"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="border-t border-[#18243a]/10 pt-6 pb-7">
                                <p className="text-sm font-semibold text-[#101d30] mb-4">
                                    Duration
                                </p>

                                <div className="space-y-3">
                                    <FilterOption
                                        label="Any duration"
                                        value=""
                                        currentValue={duration}
                                        onChange={(value) =>
                                            updateFilter(
                                                "duration",
                                                value
                                            )
                                        }
                                    />

                                    <FilterOption
                                        label="1 – 3 days"
                                        value="1-3"
                                        currentValue={duration}
                                        onChange={(value) =>
                                            updateFilter(
                                                "duration",
                                                value
                                            )
                                        }
                                    />

                                    <FilterOption
                                        label="4 – 7 days"
                                        value="4-7"
                                        currentValue={duration}
                                        onChange={(value) =>
                                            updateFilter(
                                                "duration",
                                                value
                                            )
                                        }
                                    />

                                    <FilterOption
                                        label="8 – 14 days"
                                        value="8-14"
                                        currentValue={duration}
                                        onChange={(value) =>
                                            updateFilter(
                                                "duration",
                                                value
                                            )
                                        }
                                    />

                                    <FilterOption
                                        label="15+ days"
                                        value="15-plus"
                                        currentValue={duration}
                                        onChange={(value) =>
                                            updateFilter(
                                                "duration",
                                                value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Price */}
                            <div className="border-t border-[#18243a]/10 pt-6 pb-7">
                                <p className="text-sm font-semibold text-[#101d30] mb-4">
                                    Price
                                </p>

                                <div className="space-y-3">
                                    <FilterOption
                                        label="Any price"
                                        value=""
                                        currentValue={price}
                                        onChange={(value) =>
                                            updateFilter(
                                                "price",
                                                value
                                            )
                                        }
                                    />

                                    <FilterOption
                                        label="Under $500"
                                        value="under-500"
                                        currentValue={price}
                                        onChange={(value) =>
                                            updateFilter(
                                                "price",
                                                value
                                            )
                                        }
                                    />

                                    <FilterOption
                                        label="$500 – $1,000"
                                        value="500-1000"
                                        currentValue={price}
                                        onChange={(value) =>
                                            updateFilter(
                                                "price",
                                                value
                                            )
                                        }
                                    />

                                    <FilterOption
                                        label="$1,000 – $2,000"
                                        value="1000-2000"
                                        currentValue={price}
                                        onChange={(value) =>
                                            updateFilter(
                                                "price",
                                                value
                                            )
                                        }
                                    />

                                    <FilterOption
                                        label="$2,000+"
                                        value="2000-plus"
                                        currentValue={price}
                                        onChange={(value) =>
                                            updateFilter(
                                                "price",
                                                value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="border-t border-[#18243a]/10 pt-6">
                                <p className="text-sm font-semibold text-[#101d30] mb-3">
                                    Category
                                </p>

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        updateFilter(
                                            "category",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-[#18243a]/15 bg-white px-3 py-3 text-sm text-[#18243a] outline-none focus:border-[#c99b52] focus:ring-2 focus:ring-[#c99b52]/10"
                                >
                                    <option value="">
                                        All Categories
                                    </option>
                                    <option value="Trekking">
                                        Trekking
                                    </option>
                                    <option value="Hiking">
                                        Hiking
                                    </option>
                                    <option value="Tour">
                                        Tour
                                    </option>
                                    <option value="Expedition">
                                        Expedition
                                    </option>
                                    <option value="Adventure">
                                        Adventure
                                    </option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* ====================================
                        RIGHT — PACKAGES
                    ==================================== */}
                    <section>
                        {/* Sort + result count */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <div>
                                {!loading && !error && (
                                    <p className="text-sm text-[#18243a]/50">
                                        Showing{" "}
                                        <span className="font-semibold text-[#18243a]">
                                            {packages.length}
                                        </span>{" "}
                                        {packages.length === 1
                                            ? "journey"
                                            : "journeys"}
                                    </p>
                                )}
                            </div>

                            <select
                                value={sort}
                                onChange={(e) =>
                                    updateFilter(
                                        "sort",
                                        e.target.value
                                    )
                                }
                                className="self-start sm:self-auto rounded-xl border border-[#18243a]/15 bg-white px-4 py-3 text-sm text-[#18243a] outline-none cursor-pointer focus:border-[#c99b52] focus:ring-2 focus:ring-[#c99b52]/10"
                            >
                                <option value="">Newest</option>
                                <option value="price-asc">
                                    Price: Low → High
                                </option>
                                <option value="price-desc">
                                    Price: High → Low
                                </option>
                                <option value="popular">
                                    Most Popular
                                </option>
                            </select>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-600 mb-8">
                                {error}
                            </div>
                        )}

                        {/* Loading */}
                        {loading ? (
                            <PackageSkeletons />
                        ) : packages.length === 0 ? (
                            <EmptyState onClear={() => setSearchParams({})} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
                                {packages.map((pkg) => (
                                    <PackageCard key={pkg.id || pkg._id} pkg={pkg} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

// ============================================
// FILTER OPTION
// ============================================
function FilterOption({
    label,
    value,
    currentValue,
    onChange,
}) {
    const active = currentValue === value;

    return (
        <button
            type="button"
            onClick={() => onChange(value)}
            className="w-full flex items-center gap-3 text-left group"
        >
            <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${active
                    ? "border-[#c99b52]"
                    : "border-[#18243a]/25 group-hover:border-[#c99b52]"
                    }`}
            >
                {active && (
                    <span className="w-2 h-2 rounded-full bg-[#c99b52]" />
                )}
            </span>

            <span
                className={`text-sm transition-colors ${active
                    ? "text-[#101d30] font-medium"
                    : "text-[#18243a]/55 group-hover:text-[#18243a]"
                    }`}
            >
                {label}
            </span>
        </button>
    );
}

// ============================================
// PACKAGE CARD
// ============================================
function PackageCard({ pkg }) {
    const featuredImg = pkg.images?.find((img) => img.isFeatured);
    const imgUrl =
        pkg.featuredImage || featuredImg?.url || pkg.images?.[0]?.url;

    return (
        <Link to={`/packages/${pkg.slug}`} className="group block">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-[#e9e5d9]">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#18243a]/30 text-sm">
                        No image
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#101d30]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#18243a]">
                        {pkg.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="pt-5 px-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-[0.12em] text-[#c99b52] font-semibold">
                        {pkg.difficulty}
                    </span>

                    {pkg.durationDays && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-[#18243a]/25" />
                            <span className="text-xs text-[#18243a]/45">
                                {pkg.durationDays} days
                            </span>
                        </>
                    )}
                </div>

                <h3 className="font-serif text-2xl leading-tight text-[#101d30] group-hover:text-[#c99b52] transition-colors duration-300">
                    {pkg.name}
                </h3>

                <p className="text-sm text-[#18243a]/50 mt-2">
                    {pkg.region}
                </p>

                <div className="mt-5 pt-4 border-t border-[#18243a]/10 flex items-end justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#18243a]/35 mb-1">
                            From
                        </p>

                        <p className="font-semibold text-[#101d30]">
                            ${pkg.priceUsd}
                        </p>
                    </div>

                    <span className="text-sm font-semibold text-[#c99b52] group-hover:translate-x-1 transition-transform duration-300">
                        Explore →
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ============================================
// LOADING SKELETONS
// ============================================
function PackageSkeletons() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                    <div className="aspect-[4/3] rounded-[1.5rem] bg-[#e9e5d9] animate-pulse" />

                    <div className="pt-5 px-1">
                        <div className="h-3 w-24 rounded bg-[#e9e5d9] animate-pulse mb-3" />

                        <div className="h-7 w-4/5 rounded bg-[#e9e5d9] animate-pulse mb-3" />

                        <div className="h-4 w-32 rounded bg-[#e9e5d9] animate-pulse" />

                        <div className="mt-5 pt-4 border-t border-[#18243a]/10">
                            <div className="h-4 w-20 rounded bg-[#e9e5d9] animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({ onClear }) {
    return (
        <div className="bg-white rounded-[2rem] border border-[#18243a]/10 p-14 sm:p-20 text-center">
            <p className="text-[#c99b52] uppercase tracking-[0.22em] text-xs font-semibold mb-4">
                Nothing found
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-[#101d30] mb-4">
                No journeys match
                <br />
                <span className="italic">your filters.</span>
            </h2>

            <p className="text-[#18243a]/50 text-sm max-w-md mx-auto mb-8">
                Try changing the duration or price range to discover more
                adventures.
            </p>

            <button
                onClick={onClear}
                className="rounded-lg bg-[#c99b52] hover:bg-[#a97f3d] px-6 py-3 text-white font-semibold transition"
            >
                Clear all filters
            </button>
        </div>
    );
}