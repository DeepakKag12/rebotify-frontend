import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Package, Truck } from "lucide-react";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import useAuthStore from "../../../store/authStore";

const DeliveryPartnerProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const navItems = [
    { label: "Dashboard", path: "/delivery-partner/dashboard" },
    { label: "All Deliveries", path: "/delivery-partner/deliveries" },
    { label: "Profile", path: "/delivery-partner/profile" },
  ];

  const tabs = [{ id: "profile", label: "Profile", icon: User }];

  const stats = [
    {
      icon: Package,
      label: "Total Deliveries",
      value: "0",
      color: "bg-blue-500",
    },
    {
      icon: Truck,
      label: "Completed Deliveries",
      value: "0",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account and view delivery statistics
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} p-4 rounded-xl bg-opacity-10 flex items-center justify-center`}
                >
                  <stat.icon
                    className={`w-8 h-8 ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.name || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      Email
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.email || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      Phone
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.phone || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Address
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerProfilePage;
