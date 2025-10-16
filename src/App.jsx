import { Routes, Route, Navigate } from "react-router-dom";

// Landing
import LandingPage from "./features/landing/pages/LandingPage";

// Auth
import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from "./features/auth/pages/SignupPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";

// Dashboards
import UserDashboard from "./features/user/pages/UserDashboard";
import RecyclerDashboard from "./features/recycler/pages/RecyclerDashboard";
import DeliveryPartnerDashboard from "./features/delivery-partner/pages/DeliveryPartnerDashboard";
import AdminDashboard from "./features/admin/pages/AdminDashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.userType}/dashboard`} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.userType}/dashboard`} replace />
          ) : (
            <SignupPage />
          )
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Recycler Routes */}
      <Route
        path="/recycler/dashboard"
        element={
          <ProtectedRoute allowedRoles={["recycler"]}>
            <RecyclerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Delivery Partner Routes */}
      <Route
        path="/delivery-partner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["delivery"]}>
            <DeliveryPartnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
