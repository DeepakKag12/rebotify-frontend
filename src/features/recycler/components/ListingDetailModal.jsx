import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Truck,
  Info,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import { getImageUrl } from "../../../lib/axios";
import {
  useGetBidsForListing,
  useWithdrawBid,
} from "../../../services/bidService";
import { format } from "date-fns";
import BidFormModal from "./BidFormModal";
import useAuthStore from "../../../store/authStore";
import { toast } from "react-toastify";

const ListingDetailModal = ({ listing, onClose }) => {
  const { user } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBidForm, setShowBidForm] = useState(false);

  // Fetch bids for this listing
  const {
    data: bidsData,
    isLoading: bidsLoading,
    refetch: refetchBids,
  } = useGetBidsForListing(listing._id);

  // Withdraw bid mutation
  const { mutate: withdrawBid, isPending: isWithdrawing } = useWithdrawBid();

  const images = listing.image_paths || [];
  const hasMultipleImages = images.length > 1;

  // Check if current user is the seller
  const isOwnListing =
    listing.seller._id === user?.id || listing.seller === user?.id;

  // Get all bids sorted by amount
  const allBids = bidsData?.bids?.[0]?.bids || [];

  // Check if current user has placed a bid
  const userBid = allBids.find((bid) => bid.bidder?._id === user?.id);
  const hasUserBid = !!userBid;

  const sortedBids = [...allBids].sort((a, b) => b.amount - a.amount);

  // Handle withdraw bid
  const handleWithdrawBid = () => {
    if (
      window.confirm(
        `Are you sure you want to withdraw your bid of $${userBid?.amount}?`
      )
    ) {
      withdrawBid(
        { listingId: listing._id },
        {
          onSuccess: () => {
            toast.success("Bid withdrawn successfully!");
            refetchBids(); // Refetch bids to update the UI
          },
          onError: (error) => {
            const errorMessage =
              error.response?.data?.message || "Failed to withdraw bid";
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const detailSections = [
    {
      title: "Product Details",
      icon: Package,
      items: [
        { label: "Category", value: listing.product_category },
        { label: "Brand", value: listing.brand },
        { label: "Model", value: listing.model },
        { label: "Manufacture Year", value: listing.manufacture_year },
        { label: "Condition", value: listing.condition },
        { label: "Battery Health", value: listing.battery },
        { label: "Accessories", value: listing.accessories },
      ],
    },
    {
      title: "Pricing & Delivery",
      icon: DollarSign,
      items: [
        { label: "Price", value: `$${listing.price}` },
        { label: "Price Type", value: listing.price_type },
        { label: "Delivery Options", value: listing.delivery_options },
      ],
    },
    {
      title: "Seller Information",
      icon: Info,
      items: [
        { label: "Name", value: listing.name },
        { label: "Email", value: listing.email },
        { label: "Phone", value: listing.phone },
        { label: "Contact Preference", value: listing.contact_preference },
        { label: "Location", value: listing.location },
        { label: "Address", value: listing.address },
      ],
    },
  ];

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
          className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          <div className="overflow-y-auto max-h-[90vh]">
            {/* Image Gallery */}
            <div className="relative bg-gray-900">
              {images.length > 0 ? (
                <>
                  <div className="relative h-96">
                    <img
                      src={getImageUrl(images[currentImageIndex])}
                      alt={`Product ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/800x600?text=No+Image";
                      }}
                    />

                    {/* Image Navigation */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition ${
                                index === currentImageIndex
                                  ? "bg-white w-8"
                                  : "bg-white bg-opacity-50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {hasMultipleImages && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                            index === currentImageIndex
                              ? "border-green-500"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title and Status */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {listing.brand} {listing.model}
                    </h2>
                    <p className="text-lg text-gray-600">
                      {listing.product_category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">
                      {listing.price_type === "negotiable"
                        ? "Starting Price"
                        : "Fixed Price"}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      ${listing.price}
                    </p>
                  </div>
                </div>

                {/* Posted Date */}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Posted on {format(new Date(listing.created_at), "PPP")}
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Detail Sections */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {detailSections.map((section, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <section.icon className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {section.items.map(
                        (item, idx) =>
                          item.value && (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-600">
                                {item.label}:
                              </span>
                              <span className="font-medium text-gray-900">
                                {item.value}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bid Information */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Bidding Information
                </h3>

                {bidsLoading ? (
                  <div className="text-sm text-gray-600">Loading bids...</div>
                ) : bidsData?.bids &&
                  bidsData.bids.length > 0 &&
                  bidsData.bids[0].bids.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">
                        Current Highest Bid:
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${bidsData.highestBid}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Total Bids: {bidsData.totalBids}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    No bids yet. Be the first to place a bid!
                  </div>
                )}
              </div>

              {/* Bid History */}
              {sortedBids.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Bid History
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {sortedBids.map((bid, index) => (
                      <div
                        key={bid._id || index}
                        className={`p-3 rounded-lg border ${
                          index === 0
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <Award className="w-4 h-4 text-green-600" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {bid.bidder?.name || "Anonymous"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(bid.createdAt), "PPp")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${
                                index === 0 ? "text-green-600" : "text-gray-900"
                              }`}
                            >
                              ${bid.amount}
                            </p>
                            {index === 0 && (
                              <p className="text-xs text-green-600 font-medium">
                                Highest Bid
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Link */}
              {listing.video_link && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Product Video
                  </h3>
                  <a
                    href={listing.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    View Product Video
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                {!isOwnListing && (
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    Place Bid
                  </button>
                )}
                {isOwnListing && (
                  <div className="flex-1 px-6 py-3 bg-gray-100 text-gray-500 rounded-lg text-center font-medium">
                    Your Listing
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bid Form Modal */}
      {showBidForm && (
        <BidFormModal
          listing={listing}
          currentHighestBid={bidsData?.highestBid || 0}
          onClose={() => setShowBidForm(false)}
          onSuccess={() => {
            refetchBids();
          }}
        />
      )}
    </div>
  );
};

export default ListingDetailModal;
