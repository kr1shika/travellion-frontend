import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem("admin"));

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white flex flex-col">

                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white text-slate-950 flex items-center justify-center font-bold">
                            TT
                        </div>
                        <div>
                            <h1 className="font-bold">Travelion</h1>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    <NavItem to="/admin/dashboard">Dashboard</NavItem>
                    <NavItem to="/admin/packages">Packages</NavItem>
                    <NavItem to="/admin/itineraries">Itineraries</NavItem>
                    <NavItem to="/admin/bookings">Bookings</NavItem>
                    <NavItem to="/admin/customers">Customers</NavItem>
                    <NavItem to="/admin/inquiries">Inquiries</NavItem>
                </nav>

                <div className="p-4 border-t border-slate-800">
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
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Admin Panel
                        </h2>
                        <p className="text-sm text-slate-500">
                            Travelion management
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

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function NavItem({ to, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                }`
            }
        >
            {children}
        </NavLink>
    );
}