// import { Navigate, Outlet } from "react-router-dom";

// export default function AdminProtectedRoute() {

//     const token =
//         localStorage.getItem("adminToken");

//     if (!token) {
//         return (
//             <Navigate
//                 to="/admin/login"
//                 replace
//             />
//         );
//     }

//     return <Outlet />;
// }

import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem("adminToken");
    if (!token) return <Navigate to="/admin/login" replace />;
    return children;
}