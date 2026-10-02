
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "../assets/bg.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Seo from "../components/Seo";
import { publicFetch } from "../utils/api";

const Home = () => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [featured, setFeatured] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                setError("");

                const [featuredRes, allRes] = await Promise.all([
                    publicFetch("/packages/featured?limit=3"),
                    publicFetch("/packages?limit=6&status=Published"),
                ]);

                if (featuredRes.data.success) {
                    setFeatured(featuredRes.data.data || []);
                }

                if (allRes.data.success) {
                    setPackages(allRes.data.data || []);
                }
            } catch (err) {
                setError(err.message || "Unable to load packages.");
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) return;

        navigate(
            `/packages?search=${encodeURIComponent(searchQuery.trim())}`
        );
    };

    return (
        <div className="min-h-screen bg-[#f7f5ef] text-[#18243a] overflow-hidden">
            <Header />
            <Seo
                title="Himalayan Treks, Tours & Adventures in Nepal"
                description="Discover curated Himalayan treks with Travelion Adventures. From Everest Base Camp to Annapurna, small groups, expert local guides, and unforgettable journeys."
                url="/"
            />


            {/* =====================================================
                HERO
            ====================================================== */}
            <section className="relative min-h-[100vh] flex items-end overflow-hidden">
                <img
                    src={heroBg}
                    alt="Himalayan mountains"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                />

                {/* Cinematic overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-[#081426]/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#071323]/65 via-transparent to-transparent" />

                {/* Hero content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-20 lg:pb-28">
                    <div className="max-w-4xl">
                        <p className="uppercase tracking-[0.35em] text-[#d6aa63] text-xs sm:text-sm font-semibold mb-6">
                            Explore the Himalayas
                        </p>

                        <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] leading-[0.88] font-serif tracking-tight">
                            Go beyond
                            <br />
                            <span className="italic font-light">
                                the ordinary.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-xl text-white/80 text-base sm:text-lg leading-relaxed">
                            Discover Nepal through journeys that take you
                            deeper into the mountains, cultures and landscapes
                            of the Himalayas.
                        </p>

                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="mt-9 max-w-2xl"
                        >
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 flex flex-col sm:flex-row shadow-2xl">
                                <div className="flex-1 flex items-center px-4">
                                    <svg
                                        className="w-5 h-5 text-gray-400 mr-3 shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.8}
                                            d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                                        />
                                    </svg>

                                    <input
                                        type="text"
                                        placeholder="Where will you go?"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full py-4 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#c99b52] hover:bg-[#b88b43] text-white px-7 py-4 rounded-xl font-semibold transition-all duration-300"
                                >
                                    Explore
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute right-8 bottom-16 hidden lg:flex flex-col items-center gap-3 text-white/60">
                        <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
                            Scroll to explore
                        </span>
                        <div className="w-px h-16 bg-white/40" />
                    </div>
                </div>
            </section>



            {/* =====================================================
                FEATURED TREKS
            ====================================================== */}
            {featured.length > 0 && (
                <section className="bg-white py-20 sm:py-18">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Handpicked journeys"
                            title="Featured adventures"
                            description="Our selection of unforgettable Himalayan experiences."
                            link="/packages"
                        />

                        <div className="grid lg:grid-cols-3 gap-6">
                            {featured.map((pkg, index) => (
                                <FeaturedCard
                                    key={pkg._id}
                                    pkg={pkg}
                                    featured={index === 0}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}


            <section className="bg-white py-20 sm:py-18">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Explore Nepal"
                        title="Journeys worth taking"
                        description="Find a route that matches your pace, interests and sense of adventure."
                        link="/packages"
                    />

                    {error && (
                        <div className="mb-8 rounded-xl bg-red-50 border border-red-100 px-5 py-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <PackageSkeletons />
                    ) : packages.length === 0 ? (
                        <div className="py-20 text-center border border-gray-100 rounded-2xl">
                            <p className="text-gray-500">
                                No packages available yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {packages.map((pkg) => (
                                <PackageCard
                                    key={pkg._id}
                                    pkg={pkg}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* =====================================================
                CATEGORIES
            ====================================================== */}
            <section className="bg-[#101d30] py-20 sm:py-20 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <SectionHeading
                        dark
                        eyebrow="Find your activity"
                        title="Choose your way into the mountains"
                        description="Whether you're chasing a summit or looking for a slower journey through Nepal, there's a path for you."
                    />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                        <CategoryCard
                            title="Trekking"
                            subtitle="Walk deeper"
                            image={packages[0]?.images?.[0]?.url}
                            search="Trekking"
                        />

                        <CategoryCard
                            title="Hiking"
                            subtitle="Find the trail"
                            image={packages[1]?.images?.[0]?.url}
                            search="Hiking"
                        />

                        <CategoryCard
                            title="Expedition"
                            subtitle="Reach higher"
                            image={packages[2]?.images?.[0]?.url}
                            search="Expedition"
                        />

                        <CategoryCard
                            title="Adventure"
                            subtitle="Live boldly"
                            image={packages[3]?.images?.[0]?.url}
                            search="Adventure"
                        />
                    </div>
                </div>
            </section>

            {/* =====================================================
                EXPERIENCE SPLIT SECTION
            ====================================================== */}
            <section className="bg-[#f7f5ef] py-20 sm:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] overflow-hidden rounded-[2rem]">
                                <img
                                    src={
                                        featured[0]?.images?.find(
                                            (img) => img.isFeatured
                                        )?.url ||
                                        featured[0]?.images?.[0]?.url ||
                                        heroBg
                                    }
                                    alt="Himalayan adventure"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                                />
                            </div>

                            {/* <div className="absolute -bottom-7 -right-4 sm:right-8 bg-white shadow-2xl rounded-2xl px-6 py-5">
                                <p className="text-xs uppercase tracking-widest text-gray-400">
                                    Your next
                                </p>
                                <p className="font-serif text-2xl text-[#18243a] mt-1">
                                    Great adventure.
                                </p>
                            </div> */}
                        </div>

                        <div className="lg:pl-8">
                            <p className="uppercase tracking-[0.3em] text-[#c99b52] text-xs font-semibold mb-5">
                                More than a trek
                            </p>

                            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#18243a]">
                                Travel with
                                <br />
                                <span className="italic font-light">
                                    purpose.
                                </span>
                            </h2>

                            <p className="mt-7 text-gray-600 text-lg leading-relaxed">
                                Nepal is more than mountains. It is ancient
                                trails, remote villages, prayer flags, warm
                                hospitality and moments that stay with you
                                long after you've returned home.
                            </p>

                            <p className="mt-5 text-gray-600 leading-relaxed">
                                TrekTravel brings these experiences together
                                through carefully selected journeys designed
                                for travelers who want to see more, feel more
                                and experience Nepal beyond the usual route.
                            </p>

                            <Link
                                to="/packages"
                                className="inline-flex items-center gap-3 mt-8 text-[#18243a] font-semibold group"
                            >
                                Discover our journeys
                                <span className="group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>



            {/* =====================================================
                FINAL CTA
            ====================================================== */}
            <section className="relative min-h-[65vh] flex items-center overflow-hidden">
                <img
                    src={heroBg}
                    alt="Himalayan landscape"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-[#081426]/75" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
                    <p className="uppercase tracking-[0.4em] text-[#d6aa63] text-xs font-semibold mb-6">
                        Your next chapter
                    </p>

                    <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-tight">
                        Some places
                        <br />
                        <span className="italic font-light">
                            are meant to be walked.
                        </span>
                    </h2>

                    <p className="max-w-xl mx-auto mt-7 text-white/75 text-lg leading-relaxed">
                        Find your trail. Pack your bags. Let the Himalayas
                        change the way you see the world.
                    </p>

                    <Link
                        to="/packages"
                        className="inline-flex items-center gap-3 mt-9 bg-[#c99b52] hover:bg-[#b88b43] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl"
                    >
                        Explore all journeys
                        <span>→</span>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

/* ================================================================
   SECTION HEADING
================================================================ */

function SectionHeading({
    eyebrow,
    title,
    description,
    link,
    dark = false,
}) {
    return (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-7 mb-12">
            <div className="max-w-2xl">
                <p
                    className={`uppercase tracking-[0.3em] text-xs font-semibold mb-4 ${dark ? "text-[#d6aa63]" : "text-[#c99b52]"
                        }`}
                >
                    {eyebrow}
                </p>

                <h2
                    className={`font-serif text-4xl sm:text-5xl leading-tight ${dark ? "text-white" : "text-[#18243a]"
                        }`}
                >
                    {title}
                </h2>

                {description && (
                    <p
                        className={`mt-4 text-base sm:text-lg leading-relaxed ${dark ? "text-white/60" : "text-gray-500"
                            }`}
                    >
                        {description}
                    </p>
                )}
            </div>

            {link && (
                <Link
                    to={link}
                    className={`shrink-0 font-semibold text-sm inline-flex items-center gap-2 group ${dark ? "text-white" : "text-[#18243a]"
                        }`}
                >
                    View all
                    <span className="group-hover:translate-x-1 transition-transform">
                        →
                    </span>
                </Link>
            )}
        </div>
    );
}

/* ================================================================
   STAT
================================================================ */

function Stat({ value, label }) {
    return (
        <div>
            <p className="font-serif text-3xl text-[#18243a]">{value}</p>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
                {label}
            </p>
        </div>
    );
}

/* ================================================================
   FEATURED CARD
================================================================ */

function FeaturedCard({ pkg, featured }) {
    const featuredImg = pkg.images?.find((img) => img.isFeatured);
    const imgUrl = featuredImg?.url || pkg.images?.[0]?.url;

    return (
        <Link
            to={`/packages/${pkg.slug}`}
            className={`group relative overflow-hidden rounded-[1.5rem] ${featured ? "lg:row-span-1" : ""
                }`}
        >
            <div className="relative aspect-[4/5] min-h-[420px] overflow-hidden">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={pkg.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute top-5 left-5">
                    <span className="bg-white/90 backdrop-blur-sm text-[#18243a] px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold">
                        {pkg.category}
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-white/65 text-xs uppercase tracking-wider">
                        {pkg.region}, {pkg.country}
                    </p>

                    <h3 className="font-serif text-3xl mt-2 leading-tight">
                        {pkg.name}
                    </h3>

                    <div className="flex items-center gap-5 mt-5 text-sm text-white/75">
                        <span>{pkg.durationDays} days</span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span>{pkg.difficulty}</span>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between">
                        <span className="text-sm text-white/60">
                            From
                        </span>

                        <span className="font-semibold">
                            ${pkg.priceUsd}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

/* ================================================================
   CATEGORY CARD
================================================================ */

function CategoryCard({ title, subtitle, image, search }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() =>
                navigate(
                    `/packages?category=${encodeURIComponent(search)}`
                )
            }
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl text-left"
        >
            {image ? (
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            ) : (
                <div className="absolute inset-0 bg-[#26364e]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

            <div className="absolute bottom-0 left-0 p-5 sm:p-7">
                <p className="text-white/60 text-xs uppercase tracking-widest">
                    {subtitle}
                </p>

                <h3 className="font-serif text-2xl sm:text-3xl text-white mt-1">
                    {title}
                </h3>

                <span className="inline-block mt-4 text-white/70 text-sm group-hover:text-white transition-colors">
                    Explore →
                </span>
            </div>
        </button>
    );
}

/* ================================================================
   PACKAGE CARD
================================================================ */

function PackageCard({ pkg }) {
    const featuredImg = pkg.images?.find((img) => img.isFeatured);
    const imgUrl = featuredImg?.url || pkg.images?.[0]?.url;

    return (
        <Link
            to={`/packages/${pkg.slug}`}
            className="group block"
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                    </div>
                )}

                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[#18243a] px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold">
                        {pkg.category}
                    </span>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="font-serif text-2xl text-[#18243a] group-hover:text-[#b08443] transition-colors">
                        {pkg.name}
                    </h3>

                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {pkg.durationDays} days
                    </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                    {pkg.region}, {pkg.country}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                        From
                    </span>

                    <span className="font-semibold text-[#18243a]">
                        ${pkg.priceUsd}
                    </span>
                </div>
            </div>
        </Link>
    );
}

/* ================================================================
   WHY TREKTRAVEL FEATURE
================================================================ */

function Feature({ number, title, text }) {
    return (
        <div className="bg-white/60 rounded-2xl p-7 border border-white hover:bg-white transition-colors duration-300">
            <span className="text-[#b08443] text-xs font-semibold tracking-widest">
                {number}
            </span>

            <h3 className="font-serif text-2xl text-[#18243a] mt-8">
                {title}
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed mt-3">
                {text}
            </p>
        </div>
    );
}

/* ================================================================
   LOADING SKELETON
================================================================ */

function PackageSkeletons() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse">
                    <div className="aspect-[4/3] rounded-2xl bg-gray-200" />
                    <div className="pt-5">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 mt-3" />
                        <div className="h-4 bg-gray-200 rounded w-full mt-5" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;