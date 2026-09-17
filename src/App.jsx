import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminItineraries from "./pages/admin/AdminItineraries";
import AdminItineraryForm from "./pages/admin/AdminItineraryForm";
import Home from "./pages/Home";
import PackageDetail from "./pages/PackageDetail";
import Packages from "./pages/Packages";

import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPackageForm from "./pages/admin/AdminPackageForm";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminSignup from "./pages/admin/AdminSignup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================
            PUBLIC SITE
        ============================================ */}
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:slug" element={<PackageDetail />} />

        {/* ============================================
            ADMIN AUTH
        ============================================ */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* ============================================
            PROTECTED ADMIN AREA
            (all children use RELATIVE paths)
        ============================================ */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="packages/new" element={<AdminPackageForm />} />
          <Route path="packages/edit/:id" element={<AdminPackageForm />} />
          <Route path="itineraries" element={<AdminItineraries />} />
          <Route path="itineraries/:packageId" element={<AdminItineraryForm />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;