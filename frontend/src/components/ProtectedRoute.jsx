import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If route is admin-only
  if (allowedRole === "admin" && role !== "admin") {
    return <Navigate to="/" />;
  }

  // For user routes: allow BOTH user and admin
  if (allowedRole === "user" && !["user", "admin"].includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
