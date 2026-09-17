import { useEffect, useState } from "react";
import { adminFetch } from "../../utils/adminFetch";

const STATUS_STYLES = {
    Pending:   "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Completed: "bg-blue-100 text-blue-700",
};

const PAYMENT_STYLES = {
    Pending:        "bg-yellow-100 text-yellow-700",
    Paid:           "bg-green-100 text-green-700",
    "Partially Paid": "bg-blue-100 text-blue-700",
    Refunded:       "bg-slate-100 text-slate-700",
};

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filterStatus, setFilterStatus] = useState("");
    const [filterPayment, setFilterPayment] = useState("");
    const [search, setSearch] = useState("");

    const [selectedBooking, setSelectedBooking] = useState(null);

    // ----------------------------------------
    // Fetch
    // ----------------------------------------
    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data } = await adminFetch("/bookings");
            if (data.success) setBookings(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // ----------------------------------------
    // Update status
    // ----------------------------------------
    const updateStatus = async (id, status) => {
        if (!window.confirm(`Change status to "${status}"?`)) return;

        const { data } = await adminFetch(`/bookings/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });

        if (data.success) {
            setBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status } : b))
            );

            if (selectedBooking?._id === id) {
                setSelectedBooking({ ...selectedBooking, status });
            }
        }
    };

    // ----------------------------------------
    // Delete
    // ----------------------------------------
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this booking permanently?")) return;

        const { data } = await adminFetch(`/bookings/${id}`, {
            method: "DELETE",
        });

        if (data.success) {
            setBookings((prev) => prev.filter((b) => b._id !== id));
            if (selectedBooking?._id === id) setSelectedBooking(null);
        }
    };

    // ----------------------------------------
    // Filtering
    // ----------------------------------------
    const filtered = bookings.filter((b) => {
        if (filterStatus && b.status !== filterStatus) return false;
        if (filterPayment && b.paymentStatus !== filterPayment) return false;

        if (search) {
            const q = search.toLowerCase();
            const customerName = b.customerId?.name?.toLowerCase() || "";
            const customerEmail = b.customerId?.email?.toLowerCase() || "";
            const packageName = b.packageId?.name?.toLowerCase() || "";
            const bookingId = b._id.toLowerCase();

            if (
                !customerName.includes(q) &&
                !customerEmail.includes(q) &&
                !packageName.includes(q) &&
                !bookingId.includes(q)
            ) {
                return false;
            }
        }
        return true;
    });

    // ----------------------------------------
    // Stats
    // ----------------------------------------
    const stats = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === "Pending").length,
        confirmed: bookings.filter((b) => b.status === "Confirmed").length,
        revenue: bookings
            .filter((b) => b.paymentStatus === "Paid")
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
                    <p className="text-sm text-slate-500">
                        View and manage all customer bookings
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                <StatCard title="Total Bookings" value={stats.total} />
                <StatCard title="Pending" value={stats.pending} />
                <StatCard title="Confirmed" value={stats.confirmed} />
                <StatCard title="Revenue (Paid)" value={`$${stats.revenue.toLocaleString()}`} />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search by customer, email, package, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[240px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">All Payments</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Refunded">Refunded</option>
                </select>

                {(search || filterStatus || filterPayment) && (
                    <button
                        onClick={() => {
                            setSearch("");
                            setFilterStatus("");
                            setFilterPayment("");
                        }}
                        className="text-sm text-slate-500 hover:text-slate-900 underline"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Table */}
            {loading ? (
                <p className="text-slate-500">Loading bookings...</p>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">
                        {bookings.length === 0
                            ? "No bookings yet."
                            : "No bookings match your filters."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Package</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Travel Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">People</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((b) => (
                                <tr key={b._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-900">
                                            {b.customerId?.name || "—"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {b.customerId?.email || ""}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {b.packageId?.name || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {b.travelDate
                                            ? new Date(b.travelDate).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {b.numberOfPeople}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                        ${b.totalAmount?.toLocaleString() || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-slate-100 text-slate-700"}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                                        <button
                                            onClick={() => setSelectedBooking(b)}
                                            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b._id)}
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

            {/* Detail modal */}
            {selectedBooking && (
                <BookingModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onUpdateStatus={updateStatus}
                />
            )}
        </>
    );
}

// ----------------------------------------
// Stat card
// ----------------------------------------
function StatCard({ title, value }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
    );
}

// ----------------------------------------
// Booking detail modal
// ----------------------------------------
function BookingModal({ booking, onClose, onUpdateStatus }) {
    const b = booking;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Booking Details
                        </h2>
                        <p className="text-xs text-slate-500 font-mono">
                            #{b._id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-900 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Customer */}
                    <Section title="Customer">
                        <Row label="Name" value={b.customerId?.name} />
                        <Row label="Email" value={b.customerId?.email} />
                        <Row label="Phone" value={b.customerId?.phone} />
                        <Row label="Country" value={b.customerId?.country} />
                    </Section>

                    {/* Package */}
                    <Section title="Package">
                        <Row label="Package" value={b.packageId?.name} />
                        <Row
                            label="Travel Date"
                            value={b.travelDate ? new Date(b.travelDate).toLocaleDateString() : "—"}
                        />
                        <Row label="Number of People" value={b.numberOfPeople} />
                        <Row
                            label="Total Amount"
                            value={`$${b.totalAmount?.toLocaleString() || 0} ${b.currency || "USD"}`}
                        />
                    </Section>

                    {/* Special Requests */}
                    {b.specialRequests && (
                        <Section title="Special Requests">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                {b.specialRequests}
                            </p>
                        </Section>
                    )}

                    {/* Status */}
                    <Section title="Status">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Booking Status</p>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-slate-100 text-slate-700"}`}>
                                    {b.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Payment Status</p>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${PAYMENT_STYLES[b.paymentStatus] || "bg-slate-100 text-slate-700"}`}>
                                    {b.paymentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs text-slate-500 mb-2">Change Booking Status</p>
                            <div className="flex flex-wrap gap-2">
                                {["Pending", "Confirmed", "Cancelled", "Completed"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => onUpdateStatus(b._id, s)}
                                        disabled={b.status === s}
                                        className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
                                            b.status === s
                                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                                : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* Timestamps */}
                    <Section title="Timestamps">
                        <Row
                            label="Created"
                            value={new Date(b.createdAt).toLocaleString()}
                        />
                        <Row
                            label="Last Updated"
                            value={new Date(b.updatedAt).toLocaleString()}
                        />
                    </Section>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------
// Modal subcomponents
// ----------------------------------------
function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
                {title}
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                {children}
            </div>
        </div>
    );
}

function Row({ label, value }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-900 font-medium text-right">{value}</span>
        </div>
    );
}