import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Package,
  DollarSign,
  Eye,
  X as XCircle,
  Filter,
  Loader2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import {
  useGetUserBidHistory,
  useWithdrawBid,
} from "../../../services/bidService";
import { getImageUrl } from "../../../lib/axios";
import ListingDetailModal from "../components/ListingDetailModal";

const MyBidsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all"); // all, winning, outbid, closed
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const limit = 10;

  // Fetch user's bid history
  const { data, isLoading, isError, error, refetch } = useGetUserBidHistory(
    currentPage,
    limit
  );

  // Withdraw bid mutation
  const { mutate: withdrawBid, isPending: isWithdrawing } = useWithdrawBid();

  const navItems = [
    { label: "Dashboard", path: "/recycler/dashboard" },
    { label: "Browse Listings", path: "/recycler/listings" },
    { label: "My Bids", path: "/recycler/bids" },
    { label: "Certificates", path: "/recycler/certificates" },
  ];

  // Handle withdraw bid
  const handleWithdrawBid = (listingId, bidAmount) => {
    if (
      window.confirm(
        `Are you sure you want to withdraw your bid of $${bidAmount}?`
      )
    ) {
      withdrawBid(
        { listingId },
        {
          onSuccess: () => {
            toast.success("Bid withdrawn successfully!");
            refetch(); // Refetch the bid history
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

  // Filter bids based on status
  const filteredBids =
    data?.bids?.filter((bid) => {
      if (statusFilter === "all") return true;

      const listing = bid.listing;
      const isWinning = bid.bidAmount >= bid.currentHighestBid;

      if (statusFilter === "winning")
        return listing?.status === "open" && isWinning;
      if (statusFilter === "outbid")
        return listing?.status === "open" && !isWinning;
      if (statusFilter === "closed") return listing?.status === "closed";

      return true;
    }) || [];

  const getBidStatus = (bid) => {
    const listing = bid.listing;
    const isWinning = bid.bidAmount >= bid.currentHighestBid;

    if (!listing) {
      return { label: "Unknown", color: "gray", icon: Package };
    }

    if (listing.status === "closed") {
      if (bid.isWinning) {
        return { label: "Won", color: "green", icon: Award };
      }
      return { label: "Lost", color: "red", icon: XCircle };
    }

    if (isWinning) {
      return { label: "Winning", color: "blue", icon: TrendingUp };
    }

    return { label: "Outbid", color: "orange", icon: TrendingDown };
  };

  const handleViewListing = (listing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bids</h1>
          <p className="text-gray-600">Track all your bids and their status</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 mr-2">
              Filter by:
            </span>
            {[
              { value: "all", label: "All Bids" },
              { value: "winning", label: "Winning" },
              { value: "outbid", label: "Outbid" },
              { value: "closed", label: "Closed" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === filter.value
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Bids
            </h3>
            <p className="text-gray-600 mb-4">
              {error?.response?.data?.message || "Failed to fetch your bids"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredBids.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Bids Found
            </h3>
            <p className="text-gray-600 mb-4">
              {statusFilter !== "all"
                ? `You don't have any ${statusFilter} bids`
                : "You haven't placed any bids yet"}
            </p>
            <button
              onClick={() => (window.location.href = "/recycler/listings")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Browse Listings
            </button>
          </div>
        )}

        {/* Bids Grid */}
        {!isLoading && !isError && filteredBids.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6"
          >
            {filteredBids.map((bid, index) => {
              const listing = bid.listing;
              const status = getBidStatus(bid);

              if (!listing) return null;

              return (
                <motion.div
                  key={`${bid.listing?._id}-${bid.bidDate}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-200"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-64 h-48 bg-gray-100 flex-shrink-0">
                      {listing.image_paths && listing.image_paths.length > 0 ? (
                        <img
                          src={getImageUrl(listing.image_paths[0])}
                          alt={listing.product_category}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {listing.brand} {listing.model}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {listing.product_category}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                            status.color === "green"
                              ? "bg-green-100 text-green-700"
                              : status.color === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : status.color === "orange"
                              ? "bg-orange-100 text-orange-700"
                              : status.color === "red"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Your Bid */}
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Your Bid</p>
                          <p className="text-xl font-bold text-blue-600">
                            ${bid.bidAmount || 0}
                          </p>
                        </div>

                        {/* Current Highest */}
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">
                            Highest Bid
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            ${bid.currentHighestBid || 0}
                          </p>
                        </div>

                        {/* Listing Status */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Status</p>
                          <p className="text-xl font-bold text-gray-900 capitalize">
                            {listing.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          Bid placed on {format(new Date(bid.bidDate), "PPp")}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Withdraw Button - Only show for open listings */}
                          {listing.status === "open" && (
                            <button
                              onClick={() =>
                                handleWithdrawBid(listing._id, bid.bidAmount)
                              }
                              disabled={isWithdrawing}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isWithdrawing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              Withdraw
                            </button>
                          )}

                          <button
                            onClick={() => handleViewListing(listing)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && filteredBids.length > 0 && data?.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {[...Array(data.totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-green-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(data.totalPages, prev + 1))
              }
              disabled={currentPage === data.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      {showDetailModal && selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
};

export default MyBidsPage;
