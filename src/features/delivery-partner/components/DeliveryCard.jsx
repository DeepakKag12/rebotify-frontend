import { motion } from "framer-motion";
import { Package, MapPin, Phone, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "../../../lib/axios";
import DeliveryStatusBadge from "./DeliveryStatusBadge";
import { useNavigate } from "react-router-dom";

const DeliveryCard = ({ delivery, onStatusUpdate }) => {
  const navigate = useNavigate();

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: "shipped",
      shipped: "outForDelivery",
      outForDelivery: "delivered",
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      pending: "Mark as Picked Up",
      shipped: "Mark Out for Delivery",
      outForDelivery: "Mark as Delivered",
    };
    return labels[currentStatus];
  };

  const nextStatus = getNextStatus(delivery.status_delivery);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        {/* Header with Image and Product Info */}
        <div className="flex gap-4 mb-4">
          {/* Product Image */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {delivery.orderId?.image_paths?.[0] ? (
              <img
                src={getImageUrl(delivery.orderId.image_paths[0])}
                alt={delivery.orderId.product_category}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                  {delivery.orderId?.brand} {delivery.orderId?.model}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {delivery.orderId?.product_category}
                </p>
              </div>
              <DeliveryStatusBadge status={delivery.status_delivery} />
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Tracking:</span>{" "}
                {delivery.trackingNumber}
              </p>
              <p className="text-gray-600 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Delivery by: {format(new Date(delivery.deliveryDate), "PPP")}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Pickup and Delivery Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Pickup Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-orange-500" />
              Pickup From
            </div>
            <div className="text-sm pl-6">
              <p className="font-medium text-gray-900">
                {delivery.sellerId?.name}
              </p>
              <p className="text-gray-600 line-clamp-1">
                {delivery.sellerId?.address || "Address not provided"}
              </p>
              {delivery.sellerId?.phone && (
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3" />
                  {delivery.sellerId.phone}
                </p>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-green-500" />
              Deliver To
            </div>
            <div className="text-sm pl-6">
              <p className="font-medium text-gray-900">
                {delivery.buyerId?.name}
              </p>
              <p className="text-gray-600 line-clamp-1">
                {delivery.buyerId?.address || "Address not provided"}
              </p>
              {delivery.buyerId?.phone && (
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3" />
                  {delivery.buyerId.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(`/delivery-partner/deliveries/${delivery._id}`)
            }
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          {nextStatus && (
            <button
              onClick={() => onStatusUpdate(delivery._id, nextStatus)}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              {getNextStatusLabel(delivery.status_delivery)}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryCard;
