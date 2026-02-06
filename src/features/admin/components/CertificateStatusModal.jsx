import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const CertificateStatusModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentStatus, 
  newStatus,
  certificateName 
}) => {
  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending Review",
      approved: "Approved",
      disapproved: "Disapproved",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600",
      approved: "text-green-600",
      disapproved: "text-red-600",
    };
    return colors[status] || "text-gray-600";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: AlertCircle,
      approved: CheckCircle,
      disapproved: XCircle,
    };
    return icons[status] || AlertCircle;
  };

  const getActionMessage = (status) => {
    const messages = {
      approved: "Approve this certificate and grant recycler verification?",
      disapproved: "Disapprove this certificate? The recycler will need to resubmit.",
    };
    return messages[status] || "Update certificate status?";
  };

  const getActionColor = (status) => {
    const colors = {
      approved: "bg-green-600 hover:bg-green-700",
      disapproved: "bg-red-600 hover:bg-red-700",
    };
    return colors[status] || "bg-blue-600 hover:bg-blue-700";
  };

  const CurrentIcon = getStatusIcon(currentStatus);
  const NewIcon = getStatusIcon(newStatus);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-green to-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Update Certificate Status
                </h3>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Certificate Name */}
              {certificateName && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Certificate</p>
                  <p className="font-medium text-gray-900">{certificateName}</p>
                </div>
              )}

              {/* Status Change Preview */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* Current Status */}
                <div className="flex flex-col items-center">
                  <div className={`p-3 rounded-full bg-gray-100 mb-2`}>
                    <CurrentIcon className={`w-6 h-6 ${getStatusColor(currentStatus)}`} />
                  </div>
                  <p className="text-sm text-gray-600">Current</p>
                  <p className={`font-medium ${getStatusColor(currentStatus)}`}>
                    {getStatusLabel(currentStatus)}
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                </motion.div>

                {/* New Status */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className={`p-3 rounded-full ${
                      newStatus === "approved" ? "bg-green-100" : "bg-red-100"
                    } mb-2`}
                  >
                    <NewIcon className={`w-6 h-6 ${getStatusColor(newStatus)}`} />
                  </motion.div>
                  <p className="text-sm text-gray-600">New</p>
                  <p className={`font-medium ${getStatusColor(newStatus)}`}>
                    {getStatusLabel(newStatus)}
                  </p>
                </div>
              </div>

              {/* Action Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    {getActionMessage(newStatus)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors ${getActionColor(
                    newStatus
                  )}`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CertificateStatusModal;
