import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function AdminSignup() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "Admin",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/admins`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to create admin"
                );

            }

            setSuccess(
                "Admin account created successfully."
            );

            setForm({
                name: "",
                email: "",
                password: "",
                role: "Admin",
            });

            setTimeout(() => {
                navigate("/admin/login");
            }, 1500);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-slate-950 font-bold text-xl mb-4">
                        TT
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        Trek Travel
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Create Admin Account
                    </p>

                </div>


                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        Create administrator
                    </h2>


                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                placeholder="Test Admin"
                            />

                        </div>


                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                placeholder="admin@trektravel.com"
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
                                minLength={6}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                                placeholder="Minimum 6 characters"
                            />

                        </div>


                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role
                            </label>

                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                            >

                                <option value="Admin">
                                    Admin
                                </option>

                                <option value="SuperAdmin">
                                    Super Admin
                                </option>

                            </select>

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-slate-950 py-3.5 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >

                            {loading
                                ? "Creating..."
                                : "Create Admin"}

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}