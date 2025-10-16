import { motion } from "framer-motion";
import { Package, TrendingUp, Award, MapPin } from "lucide-react";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import useAuthStore from "../../../store/authStore";

const UserDashboard = () => {
  const { user } = useAuthStore();

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "My Listings", path: "/user/listings" },
    { label: "Bids", path: "/user/bids" },
    { label: "Messages", path: "/user/messages" },
  ];

  const stats = [
    {
      icon: Package,
      label: "Total Listings",
      value: "0",
      color: "bg-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Active Bids",
      value: "0",
      color: "bg-brand-green",
    },
    {
      icon: Award,
      label: "Completed",
      value: "0",
      color: "bg-purple-500",
    },
    {
      icon: MapPin,
      label: "Near You",
      value: "0",
      color: "bg-orange-500",
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-brand-green rounded-lg hover:bg-brand-green/5 transition-colors text-left">
              <p className="font-medium text-gray-900">Create New Listing</p>
              <p className="text-sm text-gray-500 mt-1">
                Post your e-waste for recycling
              </p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <p className="font-medium text-gray-900">Browse Recyclers</p>
              <p className="text-sm text-gray-500 mt-1">
                Find certified recyclers nearby
              </p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <p className="font-medium text-gray-900">Track Deliveries</p>
              <p className="text-sm text-gray-500 mt-1">
                Monitor your e-waste pickups
              </p>
            </button>
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
