import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "../assets/bg.jpg";
import Header from "../components/Header";
import { publicFetch } from "../utils/api";

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const [featured, setFeatured] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ----------------------------------------
    // Fetch
    // ----------------------------------------
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                // Featured packages (for the top section)
                const featuredRes = await publicFetch(
                    "/packages/featured?limit=3"
                );

                // All packages
                const allRes = await publicFetch(
                    "/packages?limit=6&status=Published"
                );

                if (featuredRes.data.success) {
                    setFeatured(featuredRes.data.data);
                }
                if (allRes.data.success) {
                    setPackages(allRes.data.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ----------------------------------------
    // Search
    // ----------------------------------------
    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        navigate(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <div className="min-h-screen">
            <Header />

            {/* ============================================
                HERO
            ============================================ */}
            <section
                className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 drop-shadow-lg">
                        Search Your Next Destination
                    </h1>

                    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Where do you want to go?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-5 py-3 sm:py-4 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#cd9d4e] text-sm sm:text-base shadow-lg"
                            />
                            <button
                                type="submit"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#cd9d4e] hover:bg-[#b88d3e] text-white font-semibold rounded-lg sm:rounded-r-lg sm:rounded-l-none transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* ============================================
                FEATURED PACKAGES
            ============================================ */}
            {(featured.length > 0 || loading) && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-[#253564]">
                                    Featured Treks
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    Handpicked adventures loved by our travelers
                                </p>
                            </div>
                            <Link
                                to="/packages"
                                className="hidden sm:inline-block text-sm font-semibold text-[#cd9d4e] hover:text-[#b88d3e]"
                            >
                                View all →
                            </Link>
                        </div>

                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featured.map((pkg) => (
                                    <PackageCard key={pkg._id} pkg={pkg} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ============================================
                ALL PACKAGES
            ============================================ */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-[#253564]">
                                Explore Our Tours
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Find the perfect trek for your next adventure
                            </p>
                        </div>
                        <Link
                            to="/packages"
                            className="hidden sm:inline-block text-sm font-semibold text-[#cd9d4e] hover:text-[#b88d3e]"
                        >
                            View all →
                        </Link>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-6">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <p className="text-gray-500">Loading packages...</p>
                    ) : packages.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">
                                No packages available yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {packages.map((pkg) => (
                                <PackageCard key={pkg._id} pkg={pkg} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================
                CTA
            ============================================ */}
            <section className="py-20 bg-[#253564]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to start your journey?
                    </h2>
                    <p className="text-white/80 mb-8">
                        Browse our full catalog of handpicked Himalayan adventures.
                    </p>
                    <Link
                        to="/packages"
                        className="inline-block rounded-lg bg-[#cd9d4e] hover:bg-[#b88d3e] px-8 py-4 text-white font-semibold shadow-lg transition"
                    >
                        Browse All Packages
                    </Link>
                </div>
            </section>
        </div>
    );
};

// ============================================
// Package Card
// ============================================
function PackageCard({ pkg }) {
    const featuredImg = pkg.images?.find((img) => img.isFeatured);
    const imgUrl = featuredImg?.url || pkg.images?.[0]?.url;

    return (
        <Link
            to={`/packages/${pkg.slug}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
            <div className="h-48 bg-gray-200 overflow-hidden">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-[#cd9d4e]/10 text-[#cd9d4e] px-3 py-0.5 text-xs font-semibold">
                        {pkg.category}
                    </span>
                    <span className="text-xs text-gray-500">
                        {pkg.difficulty}
                    </span>
                </div>

                <h3 className="font-semibold text-lg text-[#253564] group-hover:text-[#cd9d4e] transition-colors line-clamp-2">
                    {pkg.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                    {pkg.region}, {pkg.country}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                        <p className="text-xs text-gray-400">From</p>
                        <p className="font-bold text-[#253564]">
                            ${pkg.price?.usd}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="font-semibold text-[#253564] text-sm">
                            {pkg.duration?.days} days
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default Home;