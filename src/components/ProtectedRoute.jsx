import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.userType)) {
    // Redirect to appropriate dashboard based on user type
    switch (user?.userType) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "recycler":
        return <Navigate to="/recycler/dashboard" replace />;
      case "delivery-partner":
        return <Navigate to="/delivery-partner/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
