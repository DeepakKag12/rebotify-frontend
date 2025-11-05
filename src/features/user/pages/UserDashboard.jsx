import { motion } from "framer-motion";
import {
  Package,
  TrendingUp,
  Award,
  MapPin,
  Plus,
  FileText,
  History,
  Settings,
  Recycle,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import useAuthStore from "../../../store/authStore";
import { useGetSellerListings } from "../../../services/listingService";

const UserDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Fetch user's listings
  const { data: listingsData } = useGetSellerListings(1, 10);

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Create Listing", path: "/user/create-listing" },
    { label: "My Listings", path: "/user/listings" },
  ];
  const stats = [
    {
      icon: Package,
      label: "Total Listings",
      value: listingsData?.totalListings || "0",
      color: "bg-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Active Listings",
      value:
        listingsData?.listings?.filter((l) => l.status === "open").length ||
        "0",
      color: "bg-brand-green",
    },
    {
      icon: Award,
      label: "Completed Deals",
      value: "0",
      color: "bg-purple-500",
    },
    {
      icon: ShoppingBag,
      label: "Total Bids",
      value: "0",
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Create New Listing",
      description: "Sell your e-waste items easily",
      color: "bg-brand-green",
      hoverColor: "hover:bg-brand-green/90",
      path: "/user/create-listing",
    },
    {
      icon: FileText,
      title: "Browse Recyclers",
      description: "Find certified recycling partners",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      path: "/user/recyclers",
    },
    {
      icon: History,
      title: "Track Deliveries",
      description: "Monitor your pickup & delivery status",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      path: "/user/deliveries",
    },
    {
      icon: Settings,
      title: "Manage Profile",
      description: "Update your account settings",
      color: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
      path: "/user/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your e-waste management today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big Create Listing Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => navigate("/user/create-listing")}
          className="w-full bg-gradient-to-r from-brand-green to-green-600 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-8 flex items-center justify-center gap-3"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xl font-semibold">Create New Listing</span>
        </motion.button>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <Recycle className="w-6 h-6 text-brand-green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                onClick={() => navigate(action.path)}
                className={`${action.color} ${action.hoverColor} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left group`}
              >
                <action.icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                <p className="text-sm text-white/90">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-500">No recent activity yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Start by creating your first listing!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
