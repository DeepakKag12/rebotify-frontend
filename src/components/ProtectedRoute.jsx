import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  console.log("🔒 ProtectedRoute Check:", {
    isAuthenticated,
    userType: user?.userType,
    allowedRoles,
    currentPath: location.pathname,
  });

  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.userType)) {
    console.log(
      "❌ User role not allowed. User type:",
      user?.userType,
      "Allowed roles:",
      allowedRoles
    );
    // Redirect to appropriate dashboard based on user type
    switch (user?.userType) {
      case "admin":
        console.log("↪️ Redirecting to admin dashboard");
        return <Navigate to="/admin/dashboard" replace />;
      case "recycler":
        console.log("↪️ Redirecting to recycler dashboard");
        return <Navigate to="/recycler/dashboard" replace />;
      case "delivery":
        console.log("↪️ Redirecting to delivery dashboard");
        return <Navigate to="/delivery-partner/dashboard" replace />;
      default:
        console.log("↪️ Redirecting to user dashboard");
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  console.log("✅ Access granted to", location.pathname);
  return children;
};

export default ProtectedRoute;
