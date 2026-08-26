import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const admin =
        JSON.parse(
            localStorage.getItem("admin")
        );

    const logout = () => {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin/login");

    };


    return (
        <div className="min-h-screen bg-slate-100">

            {/* Sidebar */}

            <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white">

                <div className="p-6 border-b border-slate-800">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-white text-slate-950 flex items-center justify-center font-bold">
                            TT
                        </div>

                        <div>
                            <h1 className="font-bold">
                                Trek Travel
                            </h1>

                            <p className="text-xs text-slate-400">
                                Admin Panel
                            </p>
                        </div>

                    </div>

                </div>


                {/* Navigation */}

                <nav className="p-4 space-y-1">

                    <a
                        href="/admin/dashboard"
                        className="block rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium"
                    >
                        Dashboard
                    </a>

                    <a
                        href="/admin/packages"
                        className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Packages
                    </a>

                    <a
                        href="/admin/bookings"
                        className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Bookings
                    </a>

                    <a
                        href="/admin/customers"
                        className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Customers
                    </a>

                    <a
                        href="/admin/inquiries"
                        className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Inquiries
                    </a>

                    <a
                        href="/admin/itineraries"
                        className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Itineraries
                    </a>

                </nav>


                {/* Logout */}

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">

                    <button
                        onClick={logout}
                        className="w-full rounded-lg px-4 py-3 text-left text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400"
                    >
                        Sign out
                    </button>

                </div>

            </aside>


            {/* Main */}

            <main className="ml-64">

                {/* Header */}

                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Dashboard
                        </h2>

                        <p className="text-sm text-slate-500">
                            Overview of your travel business
                        </p>

                    </div>


                    <div className="text-right">

                        <p className="text-sm font-semibold text-slate-900">
                            {admin?.name || "Administrator"}
                        </p>

                        <p className="text-xs text-slate-500">
                            {admin?.role || "Admin"}
                        </p>

                    </div>

                </header>


                {/* Content */}

                <div className="p-8">

                    {/* Statistics */}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                        <StatCard
                            title="Packages"
                            value="24"
                            description="Active packages"
                        />

                        <StatCard
                            title="Bookings"
                            value="128"
                            description="Total bookings"
                        />

                        <StatCard
                            title="Customers"
                            value="342"
                            description="Registered customers"
                        />

                        <StatCard
                            title="Inquiries"
                            value="18"
                            description="Pending inquiries"
                        />

                    </div>


                    {/* Welcome */}

                    <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-8">

                        <h3 className="text-2xl font-bold text-slate-900">
                            Welcome to Trek Travel Admin
                        </h3>

                        <p className="mt-2 text-slate-500 max-w-2xl">
                            Manage your trekking packages, itineraries,
                            bookings, customers and inquiries from
                            this dashboard.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}


function StatCard({
    title,
    value,
    description,
}) {

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">

            <p className="text-sm font-medium text-slate-500">
                {title}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
                {description}
            </p>

        </div>
    );
}