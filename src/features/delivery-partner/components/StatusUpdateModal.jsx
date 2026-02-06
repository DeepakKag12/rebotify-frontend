import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle } from "lucide-react";

const StatusUpdateModal = ({ isOpen, onClose, onConfirm, currentStatus, newStatus }) => {
  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      shipped: "Picked Up",
      outForDelivery: "Out for Delivery",
      delivered: "Delivered",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600",
      shipped: "text-blue-600",
      outForDelivery: "text-purple-600",
      delivered: "text-green-600",
    };
    return colors[status] || "text-gray-600";
  };

  const getActionMessage = (status) => {
    const messages = {
      shipped: "Mark this delivery as picked up from the seller?",
      outForDelivery: "Mark this delivery as out for delivery?",
      delivered: "Mark this delivery as completed?",
    };
    return messages[status] || "Update the delivery status?";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Confirm Status Update
                </h3>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition rounded-full p-1 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-6 text-lg">
                  {getActionMessage(newStatus)}
                </p>

                {/* Status Change Preview */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Current Status</p>
                      <span className={`font-semibold text-sm ${getStatusColor(currentStatus)}`}>
                        {getStatusLabel(currentStatus)}
                      </span>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">New Status</p>
                      <span className={`font-semibold text-sm ${getStatusColor(newStatus)}`}>
                        {getStatusLabel(newStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium shadow-lg shadow-green-500/30"
                  >
                    Confirm Update
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatusUpdateModal;
