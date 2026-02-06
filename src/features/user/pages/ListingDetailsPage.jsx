import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Package,
  CheckCircle,
  Loader2,
  Trash2,
  Edit,
  Award,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import { getImageUrl } from "../../../lib/axios";
import {
  useGetListing,
  useDeleteListing,
} from "../../../services/listingService";
import {
  useGetBidsForListing,
  useSelectBuyer,
} from "../../../services/bidService";

const ListingDetailsPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBidder, setSelectedBidder] = useState(null);

  const { data: listingData, isLoading } = useGetListing(listingId);
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  // Fetch bids for this listing
  const {
    data: bidsData,
    isLoading: bidsLoading,
    refetch: refetchBids,
  } = useGetBidsForListing(listingId);
  const { mutate: selectBuyer, isPending: isSelecting } = useSelectBuyer();

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Create Listing", path: "/user/create-listing" },
    { label: "My Listings", path: "/user/listings" },
  ];

  // Handle select winner - open modal (v2 - modal only, no browser confirm)
  const handleSelectWinner = (bidderId, bidAmount, bidderName, bidderEmail) => {
    console.log(
      "🎯 handleSelectWinner called - Opening modal (NO browser confirm)"
    );
    setSelectedBidder({ bidderId, bidAmount, bidderName, bidderEmail });
    setShowConfirmModal(true);
  };

  // Confirm selection
  const confirmSelectWinner = () => {
    if (!selectedBidder) return;

    selectBuyer(
      { listingId, bidderId: selectedBidder.bidderId },
      {
        onSuccess: () => {
          toast.success(
            "✅ Winner selected successfully! The buyer will receive a notification to proceed with payment."
          );
          setShowConfirmModal(false);
          setSelectedBidder(null);
          refetchBids();
          setTimeout(() => navigate("/user/listings"), 1500);
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message || "Failed to select buyer";
          toast.error(errorMessage);
          setShowConfirmModal(false);
          setSelectedBidder(null);
        },
      }
    );
  };

  const handleDeleteListing = () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      deleteListing(listingId, {
        onSuccess: () => {
          toast.success("Listing deleted successfully");
          navigate("/user/listings");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to delete listing"
          );
        },
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      case "sold":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar navItems={navItems} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      </div>
    );
  }

  const listing = listingData?.listing;

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar navItems={navItems} />
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Listing not found
          </h2>
          <button
            onClick={() => navigate("/user/listings")}
            className="mt-4 text-brand-green hover:underline"
          >
            Go back to listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/user/listings")}
          className="flex items-center gap-2 text-gray-600 hover:text-brand-green mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Product Images
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    listing.status
                  )}`}
                >
                  {listing.status?.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.image_paths?.map((imagePath, index) => (
                  <img
                    key={index}
                    src={getImageUrl(imagePath)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                ))}
                {(!listing.image_paths || listing.image_paths.length === 0) && (
                  <div className="col-span-3 flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Product Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">
                    {listing.productCategory}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Brand</p>
                  <p className="font-semibold text-gray-900">{listing.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Model</p>
                  <p className="font-semibold text-gray-900">{listing.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Year</p>
                  <p className="font-semibold text-gray-900">
                    {listing.manufacture_year || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Condition</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {listing.condition}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Battery Health</p>
                  <p className="font-semibold text-gray-900">
                    {listing.battery || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{listing.description}</p>
              </div>

              {listing.accessories && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Accessories</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.accessories.split(",").map((accessory, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {accessory.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {listing.video_link && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Video Link</p>
                  <a
                    href={listing.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green hover:underline"
                  >
                    {listing.video_link}
                  </a>
                </div>
              )}
            </motion.div>

            {/* Bids Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Bids Received
                </h2>
                {bidsData?.bids &&
                  bidsData.bids.length > 0 &&
                  bidsData.bids[0].bids.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Highest Bid</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${bidsData.highestBid}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Bids</p>
                        <p className="text-xl font-bold text-gray-900">
                          {bidsData.totalBids}
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              {bidsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">Loading bids...</p>
                </div>
              ) : bidsData?.bids &&
                bidsData.bids.length > 0 &&
                bidsData.bids[0].bids.length > 0 ? (
                <div className="space-y-3">
                  {bidsData.bids[0].bids
                    .sort((a, b) => b.amount - a.amount)
                    .map((bid, index) => (
                      <div
                        key={bid._id || index}
                        className={`p-4 border rounded-lg transition-all ${
                          index === 0
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {index === 0 && (
                                <Award className="w-5 h-5 text-green-600" />
                              )}
                              <p className="font-semibold text-gray-900">
                                {bid.bidder?.name || "Anonymous Bidder"}
                              </p>
                              {index === 0 && (
                                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold">
                                  Highest Bid
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {format(new Date(bid.createdAt), "PPp")}
                            </p>
                            {bid.bidder?.email && (
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {bid.bidder.email}
                              </p>
                            )}
                            {bid.bidder?.phone && (
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {bid.bidder.phone}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p
                              className={`text-2xl font-bold mb-2 ${
                                index === 0 ? "text-green-600" : "text-gray-900"
                              }`}
                            >
                              ${bid.amount}
                            </p>
                            {listing.status === "open" && (
                              <button
                                onClick={() =>
                                  handleSelectWinner(
                                    bid.bidder._id,
                                    bid.amount,
                                    bid.bidder.name,
                                    bid.bidder.email
                                  )
                                }
                                disabled={isSelecting}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Select Winner
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No bids received yet</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Pricing Information
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-brand-green" />
                <span className="text-3xl font-bold text-gray-900">
                  ${listing.price?.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {listing.price_type}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Delivery Options</p>
                <div className="space-y-2">
                  {listing.delivery_options?.split(',').map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle className="w-4 h-4 text-brand-green" />
                      <span className="capitalize">{option.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-green" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{listing.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-green" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{listing.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-brand-green" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {listing.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Full Address</p>
                <p className="text-sm text-gray-700">{listing.address}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">
                  Preferred Contact Method
                </p>
                <p className="text-sm text-gray-900 capitalize">
                  {listing.contact_preference}
                </p>
              </div>
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Listing Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Posted: {formatDate(listing.createdAt)}</span>
                </div>
                {listing.updatedAt && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Updated: {formatDate(listing.updatedAt)}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/user/listings/${listingId}/edit`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <Edit className="w-5 h-5" />
                Edit Listing
              </button>

              <button
                onClick={handleDeleteListing}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                {isDeleting ? "Deleting..." : "Delete Listing"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedBidder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
            >
              {/* Close button */}
              {!isSelecting && (
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedBidder(null);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Select Winner?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                You're about to finalize this sale. This action cannot be
                undone.
              </p>

              {/* Bidder Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bidder:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedBidder.bidderName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900 text-sm">
                    {selectedBidder.bidderEmail}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Sale Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${selectedBidder.bidAmount}
                  </span>
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">
                  What happens next:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Buyer will be notified to proceed with payment</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> After payment, receipt will be generated</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Delivery will be scheduled automatically</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> You'll receive payment confirmation via email</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedBidder(null);
                  }}
                  disabled={isSelecting}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSelectWinner}
                  disabled={isSelecting}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSelecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Sale
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListingDetailsPage;
