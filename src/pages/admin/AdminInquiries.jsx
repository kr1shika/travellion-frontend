import { useEffect, useState } from "react";
import { adminFetch } from "../../utils/adminFetch";

const STATUS_STYLES = {
    "New":         "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    "Resolved":    "bg-green-100 text-green-700",
    "Closed":      "bg-slate-100 text-slate-700",
};

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    // ----------------------------------------
    // Fetch (with large limit to get all)
    // ----------------------------------------
    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const { data } = await adminFetch("/inquiries?limit=1000");
            if (data.success) setInquiries(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    // ----------------------------------------
    // Update status
    // ----------------------------------------
    const updateStatus = async (id, status) => {
        const { data } = await adminFetch(`/inquiries/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        });

        if (data.success) {
            setInquiries((prev) =>
                prev.map((i) => (i._id === id ? { ...i, status } : i))
            );
            if (selectedInquiry?._id === id) {
                setSelectedInquiry({ ...selectedInquiry, status });
            }
        }
    };

    // ----------------------------------------
    // Respond
    // ----------------------------------------
    const respond = async (id, response) => {
        const { data } = await adminFetch(`/inquiries/${id}/respond`, {
            method: "PUT",
            body: JSON.stringify({ response }),
        });

        if (data.success) {
            setInquiries((prev) =>
                prev.map((i) => (i._id === id ? data.data : i))
            );
            setSelectedInquiry(data.data);
        }

        return data;
    };

    // ----------------------------------------
    // Delete
    // ----------------------------------------
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this inquiry permanently?")) return;

        const { data } = await adminFetch(`/inquiries/${id}`, {
            method: "DELETE",
        });

        if (data.success) {
            setInquiries((prev) => prev.filter((i) => i._id !== id));
            if (selectedInquiry?._id === id) setSelectedInquiry(null);
        }
    };

    // ----------------------------------------
    // Filtering
    // ----------------------------------------
    const filtered = inquiries.filter((i) => {
        if (filterStatus && i.status !== filterStatus) return false;

        if (search) {
            const q = search.toLowerCase();
            const name = i.name?.toLowerCase() || "";
            const email = i.email?.toLowerCase() || "";
            const subject = i.subject?.toLowerCase() || "";
            const message = i.message?.toLowerCase() || "";

            if (
                !name.includes(q) &&
                !email.includes(q) &&
                !subject.includes(q) &&
                !message.includes(q)
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
        total: inquiries.length,
        new: inquiries.filter((i) => i.status === "New").length,
        inProgress: inquiries.filter((i) => i.status === "In Progress").length,
        resolved: inquiries.filter((i) => i.status === "Resolved").length,
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inquiries</h1>
                    <p className="text-sm text-slate-500">
                        View and respond to customer inquiries
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                <StatCard title="Total" value={stats.total} />
                <StatCard title="New" value={stats.new} />
                <StatCard title="In Progress" value={stats.inProgress} />
                <StatCard title="Resolved" value={stats.resolved} />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search by name, email, subject, or message..."
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
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                </select>

                {(search || filterStatus) && (
                    <button
                        onClick={() => {
                            setSearch("");
                            setFilterStatus("");
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
                <p className="text-slate-500">Loading inquiries...</p>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">
                        {inquiries.length === 0
                            ? "No inquiries yet."
                            : "No inquiries match your filters."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">From</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Received</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((i) => (
                                <tr key={i._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-900">
                                            {i.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {i.email}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-900">
                                            {i.subject}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate max-w-md">
                                            {i.message}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[i.status] || "bg-slate-100 text-slate-700"}`}>
                                            {i.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {i.createdAt
                                            ? new Date(i.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                                        <button
                                            onClick={() => setSelectedInquiry(i)}
                                            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(i._id)}
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

            {/* Modal */}
            {selectedInquiry && (
                <InquiryModal
                    inquiry={selectedInquiry}
                    onClose={() => setSelectedInquiry(null)}
                    onUpdateStatus={updateStatus}
                    onRespond={respond}
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

function InquiryModal({ inquiry, onClose, onUpdateStatus, onRespond }) {
    const i = inquiry;
    const [responseText, setResponseText] = useState(i.response || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleRespond = async () => {
        if (!responseText.trim()) {
            setError("Response cannot be empty");
            return;
        }

        setSaving(true);
        setError("");

        const data = await onRespond(i._id, responseText.trim());

        if (!data.success) {
            setError(data.message || "Failed to send response");
        }

        setSaving(false);
    };

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
                            Inquiry Details
                        </h2>
                        <p className="text-xs text-slate-500 font-mono">
                            #{i._id}
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

                    {/* Sender */}
                    <Section title="From">
                        <Row label="Name" value={i.name} />
                        <Row label="Email" value={i.email} />
                        <Row label="Phone" value={i.phone} />
                    </Section>

                    {/* Message */}
                    <Section title="Message">
                        <p className="text-sm font-medium text-slate-900 mb-1">
                            {i.subject}
                        </p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                            {i.message}
                        </p>
                    </Section>

                    {/* Status */}
                    <Section title="Status">
                        <div className="flex flex-wrap gap-2">
                            {["New", "In Progress", "Resolved", "Closed"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => onUpdateStatus(i._id, s)}
                                    disabled={i.status === s}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold border ${i.status === s
                                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Response */}
                    <Section title="Response">
                        {i.response && (
                            <div className="mb-3 rounded-lg bg-white border border-slate-200 p-3">
                                <p className="text-xs text-slate-500 mb-1">
                                    Previously sent
                                    {i.respondedAt
                                        ? ` · ${new Date(i.respondedAt).toLocaleString()}`
                                        : ""}
                                </p>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                    {i.response}
                                </p>
                            </div>
                        )}

                        <textarea
                            rows={4}
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Type your response to the customer..."
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                        />

                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}

                        <div className="mt-3">
                            <button
                                onClick={handleRespond}
                                disabled={saving}
                                className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                                {saving
                                    ? "Sending..."
                                    : i.response
                                        ? "Update Response"
                                        : "Send Response"}
                            </button>
                        </div>
                    </Section>

                    {/* Timestamps */}
                    <Section title="Timestamps">
                        <Row
                            label="Received"
                            value={new Date(i.createdAt).toLocaleString()}
                        />
                        <Row
                            label="Last Updated"
                            value={new Date(i.updatedAt).toLocaleString()}
                        />
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