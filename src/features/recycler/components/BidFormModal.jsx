import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, DollarSign, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMakeBid } from "../../../services/bidService";
import useAuthStore from "../../../store/authStore";

const BidFormModal = ({ listing, currentHighestBid, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const bidAmount = watch("amount");
  const { mutate: makeBid, isPending } = useMakeBid();

  // Calculate minimum bid: 50% of listing price
  const minimumBid = listing.price / 2;

  useEffect(() => {
    // Set default bid amount to minimum bid
    setValue("amount", minimumBid);
  }, [minimumBid, setValue]);

  const onSubmit = (data) => {
    // Validate that user is not the seller
    if (listing.seller._id === user.id || listing.seller === user.id) {
      toast.error("You cannot bid on your own listing!");
      return;
    }

    // Validate minimum bid
    if (Number(data.amount) < minimumBid) {
      toast.error(`Bid must be at least $${minimumBid}`);
      return;
    }

    setIsSubmitting(true);

    makeBid(
      {
        listingId: listing._id,
        amount: Number(data.amount),
      },
      {
        onSuccess: (response) => {
          toast.success("Bid placed successfully! 🎉");
          if (onSuccess) onSuccess(response);
          onClose();
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message || "Failed to place bid";
          toast.error(errorMessage);
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Place Your Bid
                </h2>
                <p className="text-sm text-gray-600">
                  {listing.brand} {listing.model}
                </p>
              </div>
            </div>
          </div>

          {/* Listing Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Starting Price:</span>
              <span className="text-lg font-bold text-gray-900">
                ${listing.price}
              </span>
            </div>
            {currentHighestBid > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Current Highest Bid:
                </span>
                <span className="text-lg font-bold text-green-600">
                  ${currentHighestBid}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                Minimum Bid (50% of price):
              </span>
              <span className="text-lg font-bold text-blue-600">
                ${minimumBid.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Bid Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Bid Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Bid Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  min={minimumBid}
                  {...register("amount", {
                    required: "Bid amount is required",
                    min: {
                      value: minimumBid,
                      message: `Bid must be at least $${minimumBid}`,
                    },
                    validate: (value) =>
                      value > 0 || "Bid amount must be greater than zero",
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 text-lg font-semibold bg-white"
                  placeholder={minimumBid.toString()}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Bid Amount Preview */}
            {bidAmount && bidAmount >= minimumBid && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">
                      Your bid is ${(bidAmount - minimumBid).toFixed(2)} above
                      the minimum
                    </p>
                    <p className="text-xs text-green-600">
                      You'll be the highest bidder!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Warning Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Bidding Rules:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>
                      Minimum bid is 50% of the listing price ($
                      {minimumBid.toFixed(2)})
                    </li>
                    <li>You can only place one bid per listing</li>
                    <li>You can withdraw your bid before the listing closes</li>
                    <li>Seller will select the winning bid</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting || isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Bid...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    Place Bid
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BidFormModal;
