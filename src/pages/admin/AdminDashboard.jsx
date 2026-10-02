import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../components/ToastContext";
import { adminFetch } from "../../utils/adminFetch";

export default function AdminDashboard() {
    const toast = useToast();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await adminFetch("/dashboard/stats");
                if (data.success) setStats(data.data);
            } catch (err) {
                toast.error(err.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse"
                    >
                        <div className="h-4 w-24 bg-slate-100 rounded" />
                        <div className="mt-3 h-8 w-16 bg-slate-100 rounded" />
                        <div className="mt-2 h-3 w-32 bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <>
            {/* ============================================
                TOP STAT CARDS
            ============================================ */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    title="Packages"
                    value={stats.packages.total}
                    description={`${stats.packages.published} published · ${stats.packages.draft} draft`}
                    href="/admin/packages"
                />
                <StatCard
                    title="Bookings"
                    value={stats.bookings.total}
                    description={`${stats.bookings.pending} pending · ${stats.bookings.confirmed} confirmed`}
                    href="/admin/bookings"
                />
                <StatCard
                    title="Customers"
                    value={stats.customers.total}
                    description={`${stats.customers.active} active`}
                    href="/admin/customers"
                />
                <StatCard
                    title="Inquiries"
                    value={stats.inquiries.total}
                    description={`${stats.inquiries.new} new · ${stats.inquiries.inProgress} in progress`}
                    href="/admin/inquiries"
                />
            </div>

            {/* ============================================
                REVENUE + RECENT ACTIVITY
            ============================================ */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Revenue card */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6">
                    <p className="text-sm font-medium text-slate-500">
                        Revenue (Paid)
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        ${stats.bookings.revenue.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        From {stats.bookings.completed} completed bookings
                    </p>

                    <Link
                        to="/admin/bookings"
                        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900"
                    >
                        View bookings
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>

                {/* Recent bookings */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">
                            Recent Bookings
                        </h3>
                        <Link
                            to="/admin/bookings"
                            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                        >
                            View all
                        </Link>
                    </div>

                    {stats.recentBookings.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No bookings yet.
                        </p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {stats.recentBookings.map((b) => (
                                <li
                                    key={b.id}
                                    className="py-3 flex items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {b.customerName}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {b.packageName}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-semibold text-slate-900">
                                            ${Number(b.amount).toLocaleString()}
                                        </p>
                                        <span
                                            className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${b.status === "Confirmed"
                                                ? "bg-green-100 text-green-700"
                                                : b.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : b.status === "Cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {b.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* ============================================
                WELCOME
            ============================================ */}
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900">
                    Welcome back
                </h3>
                <p className="mt-2 text-slate-500 max-w-2xl">
                    Manage your trekking packages, itineraries, bookings,
                    customers and inquiries from this dashboard.
                </p>
            </div>
        </>
    );
}

function StatCard({ title, value, description, href }) {
    const inner = (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
                {value.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
    );

    return href ? (
        <Link to={href} className="block">
            {inner}
        </Link>
    ) : (
        inner
    );
}