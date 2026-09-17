import { useEffect, useState } from "react";
import { adminFetch } from "../../utils/adminFetch";

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterActive, setFilterActive] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // ----------------------------------------
    // Fetch
    // ----------------------------------------
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const { data } = await adminFetch("/customers");
            if (data.success) setCustomers(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // ----------------------------------------
    // Delete
    // ----------------------------------------
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this customer permanently?")) return;

        const { data } = await adminFetch(`/customers/${id}`, {
            method: "DELETE",
        });

        if (data.success) {
            setCustomers((prev) => prev.filter((c) => c._id !== id));
            if (selectedCustomer?._id === id) setSelectedCustomer(null);
        }
    };

    // ----------------------------------------
    // Toggle active
    // ----------------------------------------
    const toggleActive = async (customer) => {
        const { data } = await adminFetch(`/customers/${customer._id}`, {
            method: "PUT",
            body: JSON.stringify({ isActive: !customer.isActive }),
        });

        if (data.success) {
            setCustomers((prev) =>
                prev.map((c) =>
                    c._id === customer._id
                        ? { ...c, isActive: !c.isActive }
                        : c
                )
            );
            if (selectedCustomer?._id === customer._id) {
                setSelectedCustomer({
                    ...selectedCustomer,
                    isActive: !customer.isActive,
                });
            }
        }
    };

    // ----------------------------------------
    // Filtering
    // ----------------------------------------
    const filtered = customers.filter((c) => {
        if (filterActive === "active" && !c.isActive) return false;
        if (filterActive === "inactive" && c.isActive) return false;

        if (search) {
            const q = search.toLowerCase();
            const name = c.name?.toLowerCase() || "";
            const email = c.email?.toLowerCase() || "";
            const phone = c.phone?.toLowerCase() || "";
            const country = c.country?.toLowerCase() || "";

            if (
                !name.includes(q) &&
                !email.includes(q) &&
                !phone.includes(q) &&
                !country.includes(q)
            ) {
                return false;
            }
        }
        return true;
    });

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
                    <p className="text-sm text-slate-500">
                        View and manage registered customers
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <StatCard title="Total Customers" value={customers.length} />
                <StatCard
                    title="Active"
                    value={customers.filter((c) => c.isActive).length}
                />
                <StatCard
                    title="Inactive"
                    value={customers.filter((c) => !c.isActive).length}
                />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search by name, email, phone, or country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[240px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                />

                <select
                    value={filterActive}
                    onChange={(e) => setFilterActive(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                {(search || filterActive) && (
                    <button
                        onClick={() => {
                            setSearch("");
                            setFilterActive("");
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
                <p className="text-slate-500">Loading customers...</p>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">
                        {customers.length === 0
                            ? "No customers yet."
                            : "No customers match your filters."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Country</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((c) => (
                                <tr key={c._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {c.profileImage ? (
                                                <img
                                                    src={c.profileImage}
                                                    alt={c.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-semibold">
                                                    {c.name?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {c.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {c.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {c.phone || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {c.country || "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${c.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-100 text-slate-700"
                                                }`}
                                        >
                                            {c.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {c.createdAt
                                            ? new Date(c.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                                        <button
                                            onClick={() => setSelectedCustomer(c)}
                                            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => toggleActive(c)}
                                            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                        >
                                            {c.isActive ? "Deactivate" : "Activate"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c._id)}
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

            {/* Detail Modal */}
            {selectedCustomer && (
                <CustomerModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}
        </>
    );
}

// ----------------------------------------
// Subcomponents
// ----------------------------------------
function StatCard({ title, value }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
    );
}

function CustomerModal({ customer, onClose }) {
    const c = customer;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {c.profileImage ? (
                            <img
                                src={c.profileImage}
                                alt={c.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-lg font-semibold">
                                {c.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {c.name}
                            </h2>
                            <p className="text-xs text-slate-500">{c.email}</p>
                        </div>
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
                    <Section title="Contact">
                        <Row label="Email" value={c.email} />
                        <Row label="Phone" value={c.phone} />
                        <Row label="Country" value={c.country} />
                        <Row label="Address" value={c.address} />
                    </Section>

                    <Section title="Account">
                        <Row
                            label="Status"
                            value={c.isActive ? "Active" : "Inactive"}
                        />
                        <Row
                            label="Joined"
                            value={
                                c.createdAt
                                    ? new Date(c.createdAt).toLocaleString()
                                    : "—"
                            }
                        />
                        <Row
                            label="Last Login"
                            value={
                                c.lastLogin
                                    ? new Date(c.lastLogin).toLocaleString()
                                    : "Never"
                            }
                        />
                    </Section>

                    <Section title="ID">
                        <Row label="Customer ID" value={c._id} />
                    </Section>
                </div>
            </div>
        </div>
    );
}

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
            <span className="text-slate-900 font-medium text-right break-all">
                {value}
            </span>
        </div>
    );
}