import { motion } from "framer-motion";
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import useAuthStore from "../../../store/authStore";
import { useGetAllDeliveries } from "../../../services/deliveryService";
import DeliveryCard from "../components/DeliveryCard";
import StatusUpdateModal from "../components/StatusUpdateModal";
import { toast } from "react-toastify";
import { useUpdateDeliveryStatus } from "../../../services/deliveryService";
import { useState } from "react";

const DeliveryPartnerDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: deliveriesData, isLoading } = useGetAllDeliveries();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateDeliveryStatus();

  // State for status update modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

  const deliveries = deliveriesData?.DeliveryData || [];

  // Calculate statistics
  const totalDeliveries = deliveries.length;
  const pendingDeliveries = deliveries.filter(
    (d) => d.status_delivery === "pending"
  ).length;
  const activeDeliveries = deliveries.filter((d) =>
    ["shipped", "outForDelivery"].includes(d.status_delivery)
  ).length;
  const completedDeliveries = deliveries.filter(
    (d) => d.status_delivery === "delivered"
  ).length;

  // Get recent deliveries (last 5)
  const recentDeliveries = deliveries.slice(0, 5);

  const navItems = [
    { label: "Dashboard", path: "/delivery-partner/dashboard" },
    { label: "All Deliveries", path: "/delivery-partner/deliveries" },
    { label: "Profile", path: "/delivery-partner/profile" },
  ];

  const stats = [
    {
      icon: Package,
      label: "Total Deliveries",
      value: totalDeliveries,
      color: "bg-blue-500",
      onClick: () => navigate("/delivery-partner/deliveries"),
    },
    {
      icon: Clock,
      label: "Pending Pickup",
      value: pendingDeliveries,
      color: "bg-yellow-500",
      onClick: () => navigate("/delivery-partner/deliveries?status=pending"),
    },
    {
      icon: Truck,
      label: "Active Deliveries",
      value: activeDeliveries,
      color: "bg-purple-500",
      onClick: () => navigate("/delivery-partner/deliveries?status=active"),
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: completedDeliveries,
      color: "bg-green-500",
      onClick: null,
    },
  ];

  const handleStatusUpdate = (deliveryId, newStatus, currentStatus) => {
    setPendingStatusUpdate({ deliveryId, newStatus, currentStatus });
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    if (pendingStatusUpdate) {
      updateStatus(
        { deliveryId: pendingStatusUpdate.deliveryId, status: pendingStatusUpdate.newStatus },
        {
          onSuccess: () => {
            toast.success("Delivery status updated successfully!");
            setPendingStatusUpdate(null);
          },
          onError: (error) => {
            toast.error(
              error.response?.data?.message || "Failed to update status"
            );
            setPendingStatusUpdate(null);
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your delivery overview for today
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={stat.onClick}
              className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 ${
                stat.onClick ? "cursor-pointer hover:shadow-lg" : ""
              } transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/delivery-partner/deliveries")}
              className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View All Deliveries
            </button>
            <button
              onClick={() =>
                navigate("/delivery-partner/deliveries?status=pending")
              }
              className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Pending Pickups
            </button>
            <button
              onClick={() =>
                navigate("/delivery-partner/deliveries?status=active")
              }
              className="px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Truck className="w-5 h-5" />
              Active Deliveries
            </button>
          </div>
        </motion.div>

        {/* Recent Deliveries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Recent Deliveries
            </h2>
            <button
              onClick={() => navigate("/delivery-partner/deliveries")}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All →
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading deliveries...</p>
            </div>
          ) : recentDeliveries.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-100">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Deliveries Yet
              </h3>
              <p className="text-gray-600">
                New deliveries will appear here when they are assigned.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {recentDeliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery._id}
                  delivery={delivery}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setPendingStatusUpdate(null);
        }}
        onConfirm={confirmStatusUpdate}
        currentStatus={pendingStatusUpdate?.currentStatus}
        newStatus={pendingStatusUpdate?.newStatus}
      />
    </div>
  );
};

export default DeliveryPartnerDashboard;
