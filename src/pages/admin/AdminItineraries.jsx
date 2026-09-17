import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "../../utils/adminFetch";

export default function AdminItineraries() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await adminFetch("/packages/admin/all?limit=100");
                if (data.success) setPackages(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Itineraries
                    </h1>
                    <p className="text-sm text-slate-500">
                        Add or edit itinerary for each package
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {loading ? (
                <p className="text-slate-500">Loading packages...</p>
            ) : packages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">
                        No packages yet. Create a package first.
                    </p>
                    <Link
                        to="/admin/packages/new"
                        className="mt-4 inline-block text-sm font-semibold text-slate-900 underline"
                    >
                        Create package
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                    Package
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                    Itinerary
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {packages.map((pkg) => {
                                const hasItinerary = (pkg.itineraryCount || 0) > 0;
                                const isComplete =
                                    hasItinerary &&
                                    pkg.itineraryCount === pkg.duration?.days;

                                return (
                                    <tr key={pkg._id} className="hover:bg-slate-50">
                                        {/* Package info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {pkg.images?.[0]?.url ? (
                                                    <img
                                                        src={pkg.images[0].url}
                                                        alt={pkg.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                                                        No img
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {pkg.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {pkg.region}, {pkg.country}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Duration */}
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {pkg.duration?.days} days
                                        </td>

                                        {/* Itinerary status */}
                                        <td className="px-6 py-4">
                                            {!hasItinerary ? (
                                                <span className="rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-semibold">
                                                    No itinerary
                                                </span>
                                            ) : isComplete ? (
                                                <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-semibold">
                                                    {pkg.itineraryCount} / {pkg.duration?.days} days
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-yellow-50 text-yellow-700 px-3 py-1 text-xs font-semibold">
                                                    {pkg.itineraryCount} / {pkg.duration?.days} days
                                                </span>
                                            )}
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/admin/itineraries/${pkg._id}`}
                                                className={`rounded-lg px-4 py-2 text-sm font-semibold ${hasItinerary
                                                        ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                                        : "bg-slate-950 text-white hover:bg-slate-800"
                                                    }`}
                                            >
                                                {hasItinerary ? "Edit Itinerary" : "+ Add Itinerary"}
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}