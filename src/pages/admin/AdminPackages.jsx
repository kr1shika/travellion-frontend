import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "../../utils/adminFetch";

export default function AdminPackages() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const { data } = await adminFetch("/packages/admin/all?limit=100");
            if (data.success) {
                setPackages(data.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this package?")) return;
        const { data } = await adminFetch(`/packages/${id}`, {
            method: "DELETE",
        });
        if (data.success) {
            setPackages(packages.filter((p) => p._id !== id));
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Packages
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage all trekking packages
                    </p>
                </div>

                <Link
                    to="/admin/packages/new"
                    className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    + New Package
                </Link>
            </div>

            {/* Error / Loading */}
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {loading ? (
                <p className="text-slate-500">Loading packages...</p>
            ) : packages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">No packages yet.</p>
                    <Link
                        to="/admin/packages/new"
                        className="mt-4 inline-block text-sm font-semibold text-slate-900 underline"
                    >
                        Create your first package
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
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {packages.map((pkg) => (
                                <tr key={pkg._id} className="hover:bg-slate-50">
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
                                                <p className="font-semibold text-slate-900">{pkg.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {pkg.region}, {pkg.country}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {pkg.duration?.days} days
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        ${pkg.price?.usd}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${pkg.status === "Published"
                                                ? "bg-green-100 text-green-700"
                                                : pkg.status === "Draft"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-slate-100 text-slate-700"
                                                }`}
                                        >
                                            {pkg.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link
                                            to={`/admin/packages/edit/${pkg._id}`}
                                            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            to={`/admin/itineraries/${pkg._id}`}
                                            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                        >
                                            Itinerary
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(pkg._id)}
                                            className="text-sm font-semibold text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}