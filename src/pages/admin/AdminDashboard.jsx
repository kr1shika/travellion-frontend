export default function AdminDashboard() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard title="Packages" value="24" description="Active packages" />
                <StatCard title="Bookings" value="128" description="Total bookings" />
                <StatCard title="Customers" value="342" description="Registered customers" />
                <StatCard title="Inquiries" value="18" description="Pending inquiries" />
            </div>

            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900">
                    Welcome to Trek Travel Admin
                </h3>
                <p className="mt-2 text-slate-500 max-w-2xl">
                    Manage your trekking packages, itineraries, bookings, customers and inquiries from this dashboard.
                </p>
            </div>
        </>
    );
}

function StatCard({ title, value, description }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
    );
}