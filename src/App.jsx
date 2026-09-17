import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminItineraries from "./pages/admin/AdminItineraries";

import AdminItineraryForm from "./pages/admin/AdminItineraryForm";
import Home from "./pages/Home";

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
        {/* Public site */}
        <Route path="/" element={<Home />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Protected admin area — all wrapped in AdminLayout */}
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


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;