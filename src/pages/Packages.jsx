import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { publicFetch } from "../utils/api";

export default function Packages() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                params.set("limit", "24");
                if (search) params.set("search", search);
                if (category) params.set("category", category);
                if (sort) params.set("sort", sort);

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
    }, [search, category, sort]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#253564] mb-2">
                    All Packages
                </h1>
                <p className="text-gray-600 mb-8">
                    {packages.length} {packages.length === 1 ? "package" : "packages"} found
                </p>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8 flex flex-wrap gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Search packages..."
                        defaultValue={search}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const next = new URLSearchParams(searchParams);
                                next.set("search", e.target.value);
                                setSearchParams(next);
                            }
                        }}
                        className="flex-1 min-w-[240px] rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#cd9d4e]"
                    />

                    <select
                        value={category}
                        onChange={(e) => {
                            const next = new URLSearchParams(searchParams);
                            if (e.target.value) next.set("category", e.target.value);
                            else next.delete("category");
                            setSearchParams(next);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">All Categories</option>
                        <option value="Trekking">Trekking</option>
                        <option value="Hiking">Hiking</option>
                        <option value="Tour">Tour</option>
                        <option value="Expedition">Expedition</option>
                        <option value="Adventure">Adventure</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => {
                            const next = new URLSearchParams(searchParams);
                            if (e.target.value) next.set("sort", e.target.value);
                            else next.delete("sort");
                            setSearchParams(next);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Newest</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : packages.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <p className="text-gray-500">No packages found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <PackageCard key={pkg._id} pkg={pkg} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

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