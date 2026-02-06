import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Users,
  FileCheck,
  Calendar,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import { useAdminStats, useCertificateStats } from "../../../services/adminService";
import useAuthStore from "../../../store/authStore";

const AdminProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: adminStats, isLoading: statsLoading } = useAdminStats();
  const { data: certStats, isLoading: certLoading } = useCertificateStats();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Certificates", path: "/admin/certificates" },
    { label: "Profile", path: "/admin/profile" },
  ];

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "activity", label: "Platform Stats", icon: Activity },
  ];

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: adminStats?.totalUsers || 0,
      color: "bg-blue-500",
    },
    {
      icon: FileCheck,
      label: "Pending Certificates",
      value: certStats?.byStatus?.pending || 0,
      color: "bg-yellow-500",
    },
    {
      icon: Activity,
      label: "Active Users (30d)",
      value: adminStats?.activeUsers || 0,
      color: "bg-green-500",
    },
    {
      icon: Shield,
      label: "Role",
      value: "Administrator",
      color: "bg-purple-500",
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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Profile
            </h1>
          </div>
          <p className="text-gray-600">
            Manage your admin account and view platform statistics
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
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

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 font-medium transition border-b-2 ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">
                        {user?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900">
                        {user?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900">
                        {user?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {user?.userType || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-gray-900">
                        {user?.addresses?.[0]?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-900">
                        {user?.createdAt
                          ? format(new Date(user.createdAt), "MMMM d, yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Platform Stats Tab */}
            {activeTab === "activity" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Platform Statistics
                </h3>

                {statsLoading || certLoading ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-300 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-500">Loading statistics...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* User Stats */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          User Statistics
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Total Users</span>
                          <span className="font-bold text-gray-900">
                            {adminStats?.totalUsers || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Active (30d)</span>
                          <span className="font-bold text-green-600">
                            {adminStats?.activeUsers || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Retention Rate</span>
                          <span className="font-bold text-blue-600">
                            {adminStats?.retentionRate
                              ? `${adminStats.retentionRate.toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Type Distribution */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          User Types
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Regular Users</span>
                          <span className="font-bold text-gray-900">
                            {adminStats?.usersByType?.user || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Recyclers</span>
                          <span className="font-bold text-green-600">
                            {adminStats?.usersByType?.recycler || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            Delivery Partners
                          </span>
                          <span className="font-bold text-blue-600">
                            {adminStats?.usersByType?.delivery || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Admins</span>
                          <span className="font-bold text-purple-600">
                            {adminStats?.usersByType?.admin || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Stats */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          Certificates
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Total</span>
                          <span className="font-bold text-gray-900">
                            {certStats?.totalCertificates || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Pending Review</span>
                          <span className="font-bold text-yellow-600">
                            {certStats?.byStatus?.pending || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Approved</span>
                          <span className="font-bold text-green-600">
                            {certStats?.byStatus?.approved || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Disapproved</span>
                          <span className="font-bold text-red-600">
                            {certStats?.byStatus?.disapproved || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          System Status
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Platform Status</span>
                          <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-semibold">
                            Operational
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Last Updated</span>
                          <span className="font-bold text-gray-900">
                            {format(new Date(), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Version</span>
                          <span className="font-bold text-gray-900">v1.0.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
