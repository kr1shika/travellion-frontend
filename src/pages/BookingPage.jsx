
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { publicFetch } from "../utils/api";
export default function RequestBookingPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        address: "",
        travelDate: "",
        numberOfPeople: 1,
        specialRequests: "",
    });

    // Load package
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await publicFetch(`/packages/${slug}`);
                if (!data.success) throw new Error(data.message);
                setPkg(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const pricePerPerson = pkg?.price?.usd || 0;
    const numberOfPeople = Number(form.numberOfPeople) || 1;
    const subtotal = pricePerPerson * numberOfPeople;
    const depositAmount = Math.round(subtotal * 0.2);
    const bankCharge = Math.round(depositAmount * 0.035);
    const payableAmount = depositAmount + bankCharge;
    const dueAmount = subtotal - depositAmount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.fullName || !form.email || !form.phone) {
            setError("Full name, email, and phone are required");
            return;
        }
        if (!form.travelDate) {
            setError("Please select a preferred travel date");
            return;
        }

        setSubmitting(true);

        try {
            // 1. Find or create customer
            const customerRes = await publicFetch("/customers/find-or-create", {
                method: "POST",
                body: JSON.stringify({
                    name: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    country: form.country,
                    address: form.address,
                }),
            });

            if (!customerRes.data.success) {
                throw new Error(
                    customerRes.data.message || "Failed to process your details"
                );
            }

            const customerId = customerRes.data.data._id;

            // 2. Create booking as PENDING (request, not confirmed)
            const bookingRes = await publicFetch("/bookings", {
                method: "POST",
                body: JSON.stringify({
                    customerId,
                    packageId: pkg._id,
                    travelDate: form.travelDate,
                    numberOfPeople,
                    specialRequests: form.specialRequests,
                    paymentMethod: "Request — Pending Follow-up",
                }),
            });

            if (!bookingRes.data.success) {
                throw new Error(
                    bookingRes.data.message || "Failed to submit request"
                );
            }

            // 3. Notify admin via email (fire and forget)
            try {
                await publicFetch("/bookings/notify-admin", {
                    method: "POST",
                    body: JSON.stringify({
                        bookingId: bookingRes.data.data._id,
                        packageName: pkg.name,
                        customerName: form.fullName,
                        customerEmail: form.email,
                        customerPhone: form.phone,
                        travelDate: form.travelDate,
                        numberOfPeople,
                        specialRequests: form.specialRequests,
                    }),
                });
            } catch (notifyErr) {
                // Don't block the user if email fails
                console.error("Admin notify failed:", notifyErr);
            }

            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ---------- Loading ----------
    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-24">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <p className="text-gray-500">Loading package...</p>
                </div>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen bg-white pt-24">
                <Header />
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-[#253564] mb-3">
                        Package not found
                    </h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        to="/packages"
                        className="inline-block rounded-lg bg-[#cd9d4e] hover:bg-[#b88d3e] text-white font-semibold px-6 py-3"
                    >
                        Browse all packages
                    </Link>
                </div>
            </div>
        );
    }

    // ---------- Success screen ----------
    if (submitted) {
        return (
            <div className="min-h-screen bg-white pt-24">
                <Header />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                        <svg
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-[#253564] mb-4">
                        Request Received!
                    </h1>

                    <p className="text-gray-600 mb-2">
                        Thank you, <strong>{form.fullName}</strong>.
                    </p>

                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                        Your booking request for{" "}
                        <strong>{pkg.name}</strong> has been submitted
                        successfully. Our team will get back to you via{" "}
                        <strong>email or phone</strong> within 24 hours with
                        confirmation and next steps.
                    </p>

                    <div className="bg-[#f8f7f3] border border-[#e8e3d3] rounded-xl p-6 mb-8 text-left">
                        <h3 className="text-sm font-semibold text-[#253564] uppercase tracking-wide mb-3">
                            What happens next?
                        </h3>
                        <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                            <li>
                                We review your request and check availability.
                            </li>
                            <li>
                                You'll receive an email or call from our team
                                with confirmation and deposit instructions.
                            </li>
                            <li>
                                Once the deposit is received, your spot is
                                officially booked.
                            </li>
                        </ol>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            to="/packages"
                            className="rounded-lg bg-[#cd9d4e] hover:bg-[#b88d3e] text-white font-semibold px-6 py-3"
                        >
                            Browse More Packages
                        </Link>
                        <Link
                            to="/"
                            className="rounded-lg border border-gray-300 text-gray-700 font-semibold px-6 py-3 hover:bg-gray-50"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ---------- Main form ----------
    return (
        <div className="min-h-screen bg-white pt-24">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    {/* <p className="text-[#cd9d4e] uppercase tracking-widest text-xs font-semibold mb-3">
                        Send a Request
                    </p> */}
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#253564]">
                        Request Booking
                    </h1>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                        Fill in your details below. Our team will contact you
                        shortly to confirm availability and guide you through
                        the booking.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 max-w-3xl mx-auto rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* LEFT — FORM */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Top row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm text-gray-600 whitespace-nowrap">
                                        Number of Travellers:
                                    </label>
                                    <input
                                        type="number"
                                        name="numberOfPeople"
                                        min="1"
                                        value={form.numberOfPeople}
                                        onChange={handleChange}
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#cd9d4e]"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="text-sm text-gray-600 whitespace-nowrap">
                                        Preferred Date:*
                                    </label>
                                    <input
                                        type="date"
                                        name="travelDate"
                                        value={form.travelDate}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#cd9d4e]"
                                    />
                                </div>
                            </div>

                            {/* Traveller info */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#253564] mb-6">
                                    Traveller Info
                                </h2>

                                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <FloatingInput
                                            label="Enter Fullname"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <FloatingInput
                                            label="Enter Email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <FloatingInput
                                            label="Mobile Number"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        <FloatingInput
                                            label="Country"
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <FloatingInput
                                        label="Enter Contact Address"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#253564] mb-2">
                                    Your Specific Requirements
                                </h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    Send us a note if you have special
                                    requirements, dietary needs, or questions.
                                </p>
                                <textarea
                                    name="specialRequests"
                                    rows={6}
                                    value={form.specialRequests}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#cd9d4e]"
                                />
                            </div>
                        </div>

                        {/* RIGHT — SUMMARY */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 border-2 border-[#a5c5d9] rounded-2xl p-6 bg-white">
                                <h2 className="text-xl font-bold text-[#253564] mb-6">
                                    Trip Detail
                                </h2>

                                <p className="text-sm text-gray-800 pb-3 border-b border-gray-100">
                                    {pkg.name}
                                </p>

                                <div className="mt-4 space-y-3 text-sm">
                                    <SummaryRow
                                        icon="clock"
                                        label="Duration"
                                        value={`${pkg.duration?.days} Days`}
                                    />
                                    <SummaryRow
                                        icon="calendar"
                                        label="Preferred Date"
                                        value={form.travelDate || "—"}
                                    />
                                    <SummaryRow
                                        icon="users"
                                        label="Travellers"
                                        value={numberOfPeople}
                                    />
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3 text-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-2">
                                            <DollarIcon />
                                            <div>
                                                <p className="font-semibold text-[#253564]">
                                                    Cost
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    USD {pricePerPerson} × {numberOfPeople} Traveller(s)
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-[#253564]">
                                            ${subtotal}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-2">
                                            <DollarIcon />
                                            <div>
                                                <p className="font-semibold text-[#253564]">
                                                    Suggested Deposit
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    (~20% — confirmable later)
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-[#253564]">
                                            ${depositAmount}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-start pt-3 border-t border-gray-100">
                                        <div className="flex items-start gap-2">
                                            <DollarIcon />
                                            <div>
                                                <p className="font-semibold text-[#253564]">
                                                    Amount Due Later
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    (Pay upon arrival)
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-[#253564]">
                                            ${dueAmount}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="mt-6 w-full rounded-lg bg-[#cd9d4e] hover:bg-[#b88d3e] text-white font-semibold py-3.5 transition disabled:opacity-60"
                                >
                                    {submitting
                                        ? "Sending Request..."
                                        : "Send Booking Request"}
                                </button>

                                <p className="mt-3 text-xs text-center text-gray-500">
                                    No payment required now. Our team will
                                    contact you within 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

// ------------------------------
// Subcomponents
// ------------------------------
function FloatingInput({ label, ...props }) {
    return (
        <div className="relative">
            <input
                {...props}
                placeholder=" "
                className="peer w-full rounded-full border border-gray-300 px-5 py-3.5 text-sm outline-none focus:border-[#cd9d4e] bg-white"
            />
            <label className="absolute -top-2 left-4 bg-white px-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#cd9d4e] transition-all cursor-text">
                {label}
            </label>
        </div>
    );
}

function SummaryRow({ icon, label, value }) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
                <span className="text-[#5b8fa8]">
                    {icon === "clock" && "🕐"}
                    {icon === "calendar" && "📅"}
                    {icon === "users" && "👥"}
                </span>
                <span>{label}</span>
            </div>
            <span className="font-medium text-[#253564]">{value}</span>
        </div>
    );
}

function DollarIcon() {
    return (
        <svg
            className="w-5 h-5 text-[#5b8fa8] flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M14 9h-2.5a1.5 1.5 0 000 3h1a1.5 1.5 0 010 3H10M12 6.5v11" />
        </svg>
    );
}