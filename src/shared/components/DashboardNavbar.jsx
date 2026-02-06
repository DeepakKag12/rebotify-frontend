import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, User, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore";
import { useLogout } from "../../services/authService";
import { toast } from "react-toastify";

const DashboardNavbar = ({ navItems = [] }) => {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        window.location.href = "/";
      },
    });
  };

  // Get profile path based on user role
  const getProfilePath = () => {
    const userRole = user?.userType;

    if (userRole === "user") {
      return "/user/profile";
    }
    if (userRole === "recycler") {
      return "/recycler/profile";
    }
    if (userRole === "delivery" || userRole === "delivery_partner") {
      return "/delivery-partner/dashboard";
    }
    if (userRole === "admin") {
      return "/admin/profile";
    }
    return "/profile";
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo & Company Name */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-olive">Rebot</span>
          </Link>

          {/* Center - Navigation Items */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-gray-700 hover:text-brand-green font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right - Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-brand-green" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.userType}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  {/* Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to={getProfilePath()}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation */}
        {navItems.length > 0 && (
          <div className="md:hidden mt-4 flex flex-wrap gap-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-sm text-gray-700 hover:text-brand-green font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* Profile Link */}
            <Link
              to={getProfilePath()}
              className="text-sm text-gray-700 hover:text-brand-green font-medium transition-colors"
            >
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;
