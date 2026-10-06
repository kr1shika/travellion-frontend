import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ToastContext";

import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import { ConfirmProvider } from "./components/ConfirmContext";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminItineraries from "./pages/admin/AdminItineraries";
import AdminItineraryForm from "./pages/admin/AdminItineraryForm";
import BookingPage from "./pages/BookingPage";
import Home from "./pages/Home";
import PackageDetail from "./pages/PackageDetail";
import Packages from "./pages/Packages";

import About from "./pages/About";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPackageForm from "./pages/admin/AdminPackageForm";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminSignup from "./pages/admin/AdminSignup";
import Contact from "./pages/Contact";
function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>


          <Routes>
            {/* ============================================
            PUBLIC SITE
        ============================================ */}
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:slug" element={<PackageDetail />} />
            <Route path="/packages/:slug/booking-request" element={<BookingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ============================================
            ADMIN AUTH
        ============================================ */}
            <Route path="/manage9x7k2/login" element={<AdminLogin />} />
            <Route path="/manage9x7k2/signup" element={<AdminSignup />} />

            {/* ============================================
            PROTECTED ADMIN AREA
            (all children use RELATIVE paths)
        ============================================ */}
            <Route
              path="/manage9x7k2"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/manage9x7k2/dashboard" replace />} />
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
        </ConfirmProvider>

      </ToastProvider>

    </BrowserRouter>
  );
}

export default App;