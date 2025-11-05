import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Package,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import {
  useGetAllDeliveries,
  useUpdateDeliveryStatus,
} from "../../../services/deliveryService";
import DeliveryCard from "../components/DeliveryCard";
import { toast } from "react-toastify";

const AllDeliveriesPage = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");

  const { data: deliveriesData, isLoading } = useGetAllDeliveries();
  const { mutate: updateStatus } = useUpdateDeliveryStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(statusFilter || "all");

  const deliveries = deliveriesData?.DeliveryData || [];

  const navItems = [
    { label: "Dashboard", path: "/delivery-partner/dashboard" },
    { label: "All Deliveries", path: "/delivery-partner/deliveries" },
    { label: "Profile", path: "/delivery-partner/profile" },
  ];

  const statusOptions = [
    { value: "all", label: "All Deliveries", icon: Package },
    { value: "pending", label: "Pending Pickup", icon: Clock },
    { value: "active", label: "Active", icon: Truck },
    { value: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    // Status filter
    if (selectedStatus === "active") {
      if (!["shipped", "outForDelivery"].includes(delivery.status_delivery)) {
        return false;
      }
    } else if (selectedStatus !== "all") {
      if (delivery.status_delivery !== selectedStatus) {
        return false;
      }
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        delivery.trackingNumber?.toLowerCase().includes(search) ||
        delivery.orderId?.product_category?.toLowerCase().includes(search) ||
        delivery.orderId?.brand?.toLowerCase().includes(search) ||
        delivery.orderId?.model?.toLowerCase().includes(search) ||
        delivery.buyerId?.name?.toLowerCase().includes(search) ||
        delivery.sellerId?.name?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const handleStatusUpdate = (deliveryId, newStatus) => {
    if (
      window.confirm("Are you sure you want to update the delivery status?")
    ) {
      updateStatus(
        { deliveryId, status: newStatus },
        {
          onSuccess: () => {
            toast.success("Delivery status updated successfully!");
          },
          onError: (error) => {
            toast.error(
              error.response?.data?.message || "Failed to update status"
            );
          },
        }
      );
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Deliveries
          </h1>
          <p className="text-gray-600">
            Manage and track all your delivery assignments
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6"
        >
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by tracking number, product, buyer, or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 mr-2">
              Filter by status:
            </span>
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    selectedStatus === option.value
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredDeliveries.length}</span>{" "}
            of <span className="font-semibold">{deliveries.length}</span>{" "}
            deliveries
          </p>
        </motion.div>

        {/* Deliveries List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading deliveries...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-16 text-center shadow-md border border-gray-100"
          >
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Deliveries Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedStatus !== "all"
                ? "Try adjusting your filters or search term"
                : "New deliveries will appear here when they are assigned"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 gap-6"
          >
            {filteredDeliveries.map((delivery, index) => (
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DeliveryCard
                  delivery={delivery}
                  onStatusUpdate={handleStatusUpdate}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllDeliveriesPage;
