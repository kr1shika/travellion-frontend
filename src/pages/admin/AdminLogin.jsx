import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
    const navigate = useNavigate();

    // "credentials" → email + password
    // "otp"         → 6-digit code
    const [step, setStep] = useState("credentials");

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [otp, setOtp] = useState("");
    const [pendingEmail, setPendingEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    // ============================================
    // Change handlers
    // ============================================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOtpChange = (e) => {
        // Only digits, max 6
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
    };

    // ============================================
    // Step 1 — email + password → request OTP
    // ============================================
    const handleCredentials = async (e) => {
        e.preventDefault();
        setError("");
        setInfo("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/admins/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Login failed");
            }

            setPendingEmail(data.data.email || form.email);
            setInfo(`Code sent to ${data.data.email || form.email}`);
            setStep("otp");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // Step 2 — OTP → JWT
    // ============================================
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/admins/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: pendingEmail,
                    code: otp,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Verification failed");
            }

            // Save token
            localStorage.setItem("adminToken", data.data.token);

            // Save admin information
            localStorage.setItem("admin", JSON.stringify(data.data.admin));

            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // Resend OTP
    // ============================================
    const handleResend = async () => {
        setError("");
        setInfo("");

        try {
            const response = await fetch(`${API_URL}/admins/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: pendingEmail }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not resend code");
            }

            setOtp("");
            setInfo("New code sent to your email");
        } catch (err) {
            setError(err.message);
        }
    };

    // ============================================
    // Back to credentials step
    // ============================================
    const handleBack = () => {
        setStep("credentials");
        setOtp("");
        setError("");
        setInfo("");
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-slate-950 font-bold text-xl mb-4">
                        TT
                    </div>
                    <h1 className="text-3xl font-bold text-white">
                        Travelion
                    </h1>
                    <p className="text-slate-400 mt-2">Admin Portal</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* ============================================
                        STEP 1 — CREDENTIALS
                    ============================================ */}
                    {step === "credentials" && (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Welcome back
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Sign in to manage your travel platform.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <form
                                onSubmit={handleCredentials}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="admin@travelionadventures.com"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-slate-950 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Checking credentials..."
                                        : "Continue"}
                                </button>
                            </form>
                        </>
                    )}

                    {/* ============================================
                        STEP 2 — OTP
                    ============================================ */}
                    {step === "otp" && (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Enter your code
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    We sent a 6-digit code to
                                </p>
                                <p className="text-sm font-medium text-slate-900 mt-0.5 break-all">
                                    {pendingEmail}
                                </p>
                            </div>

                            {info && (
                                <div className="mb-5 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                                    {info}
                                </div>
                            )}

                            {error && (
                                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <form
                                onSubmit={handleVerifyOTP}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Verification code
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="000000"
                                        autoFocus
                                        maxLength={6}
                                        required
                                        className="w-full text-center tracking-[0.5em] text-2xl font-mono rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                    />
                                    <p className="mt-2 text-xs text-slate-400 text-center">
                                        Expires in 5 minutes
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full rounded-lg bg-slate-950 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Verifying..."
                                        : "Verify & Sign In"}
                                </button>

                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="text-slate-500 hover:text-slate-900 transition-colors"
                                    >
                                        ← Use a different account
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="font-semibold text-[#cd9d4e] hover:text-[#b88d3e] transition-colors"
                                    >
                                        Resend code
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                <p className="text-center text-xs text-slate-500 mt-6">
                    Travelion Administration
                </p>
            </div>
        </div>
    );
}