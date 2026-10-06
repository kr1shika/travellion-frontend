
// }

import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem("adminToken");
    if (!token) return <Navigate to="/manage9x7k2/login" replace />;
    return children;
}