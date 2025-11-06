import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Truck,
  CheckCircle,
  Edit,
  X,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import {
  useGetDeliveryById,
  useUpdateDeliveryStatus,
} from "../../../services/deliveryService";
import DeliveryStatusBadge from "../components/DeliveryStatusBadge";
import { getImageUrl } from "../../../lib/axios";
import { toast } from "react-toastify";

const DeliveryDetailsPage = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const { data: deliveryData, isLoading } = useGetDeliveryById(deliveryId);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateDeliveryStatus();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");

  const delivery = deliveryData?.delivery;

  const navItems = [
    { label: "Dashboard", path: "/delivery-partner/dashboard" },
    { label: "All Deliveries", path: "/delivery-partner/deliveries" },
    { label: "Profile", path: "/delivery-partner/profile" },
  ];

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: "shipped",
      shipped: "outForDelivery",
      outForDelivery: "delivered",
    };
    return statusFlow[currentStatus];
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pick Up from Seller",
      shipped: "Mark Out for Delivery",
      outForDelivery: "Mark as Delivered",
      delivered: "Delivery Complete",
    };
    return labels[status];
  };

  const handleUpdateStatus = () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    updateStatus(
      {
        deliveryId: delivery._id,
        status: selectedStatus,
        notes,
      },
      {
        onSuccess: () => {
          toast.success("Delivery status updated successfully!");
          setShowUpdateModal(false);
          setNotes("");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update status"
          );
        },
      }
    );
  };

  const openUpdateModal = () => {
    const nextStatus = getNextStatus(delivery?.status_delivery);
    if (nextStatus) {
      setSelectedStatus(nextStatus);
      setShowUpdateModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar navItems={navItems} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading delivery details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar navItems={navItems} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Delivery Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The delivery you're looking for doesn't exist
            </p>
            <button
              onClick={() => navigate("/delivery-partner/deliveries")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Back to Deliveries
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nextStatus = getNextStatus(delivery.status_delivery);

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
          <button
            onClick={() => navigate("/delivery-partner/deliveries")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Deliveries
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Delivery Details
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-gray-600">
                  <span className="font-medium">Tracking:</span>{" "}
                  {delivery.trackingNumber}
                </p>
                <DeliveryStatusBadge
                  status={delivery.status_delivery}
                  size="lg"
                />
              </div>
            </div>

            {nextStatus && (
              <button
                onClick={openUpdateModal}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Update Status
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Product Information
              </h2>

              <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {delivery.orderId?.image_paths?.[0] ? (
                    <img
                      src={getImageUrl(delivery.orderId.image_paths[0])}
                      alt={delivery.orderId.product_category}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {delivery.orderId?.brand} {delivery.orderId?.model}
                  </h3>
                  <p className="text-gray-600 capitalize mb-3">
                    Category: {delivery.orderId?.product_category}
                  </p>
                  {delivery.orderId?.description && (
                    <p className="text-gray-700 text-sm">
                      {delivery.orderId.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Pickup Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-500" />
                Pickup Details
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {delivery.sellerId?.name}
                    </p>
                    <p className="text-sm text-gray-600">Seller</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">
                      {delivery.sellerId?.addresses?.[0]?.address ||
                        "Address not provided"}
                    </p>
                    <p className="text-sm text-gray-600">Pickup Address</p>
                  </div>
                </div>

                {delivery.sellerId?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a
                      href={`tel:${delivery.sellerId.phone}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {delivery.sellerId.phone}
                    </a>
                  </div>
                )}

                {delivery.sellerId?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a
                      href={`mailto:${delivery.sellerId.email}`}
                      className="text-green-600 hover:text-green-700"
                    >
                      {delivery.sellerId.email}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Delivery Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-500" />
                Delivery Details
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {delivery.buyerId?.name}
                    </p>
                    <p className="text-sm text-gray-600">Buyer</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">
                      {delivery.buyerId?.addresses?.[0]?.address ||
                        "Address not provided"}
                    </p>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                  </div>
                </div>

                {delivery.buyerId?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a
                      href={`tel:${delivery.buyerId.phone}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {delivery.buyerId.phone}
                    </a>
                  </div>
                )}

                {delivery.buyerId?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a
                      href={`mailto:${delivery.buyerId.email}`}
                      className="text-green-600 hover:text-green-700"
                    >
                      {delivery.buyerId.email}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">
                      {format(new Date(delivery.deliveryDate), "PPP")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Scheduled Delivery Date
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                Delivery Timeline
              </h2>

              <div className="space-y-6">
                {delivery.statusHistory?.map((history, index) => {
                  const isLast = index === delivery.statusHistory.length - 1;
                  const isCompleted = true; // All history items are completed

                  return (
                    <div key={index} className="relative">
                      {!isLast && (
                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-green-200"></div>
                      )}

                      <div className="flex gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </div>

                        <div className="flex-1 pb-6">
                          <p className="font-semibold text-gray-900 capitalize">
                            {getStatusLabel(history.status)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {format(new Date(history.timestamp), "PPp")}
                          </p>
                          {history.notes && (
                            <p className="text-sm text-gray-700 mt-2 italic">
                              "{history.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Future Steps */}
                {delivery.status_delivery !== "delivered" && (
                  <>
                    {nextStatus && (
                      <div className="relative opacity-50">
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-400">
                            <Clock className="w-5 h-5" />
                          </div>

                          <div className="flex-1">
                            <p className="font-semibold text-gray-600 capitalize">
                              {getStatusLabel(nextStatus)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Pending
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <AnimatePresence>
        {showUpdateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Update Delivery Status
                </h3>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </p>
                  <DeliveryStatusBadge status={delivery.status_delivery} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </p>
                  <DeliveryStatusBadge status={selectedStatus} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this status update..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Confirm Update"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryDetailsPage;
