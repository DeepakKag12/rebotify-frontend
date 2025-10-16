import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import { getImageUrl } from "../../../lib/axios";
import {
  useGetSellerListings,
  useDeleteListing,
} from "../../../services/listingService";

const MyListingsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: listingsData, isLoading } = useGetSellerListings(page, limit);
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Create Listing", path: "/user/create-listing" },
    { label: "My Listings", path: "/user/listings" },
  ];

  const handleViewDetails = (listingId) => {
    navigate(`/user/listings/${listingId}`);
  };

  const handleDeleteListing = (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      deleteListing(listingId, {
        onSuccess: () => {
          toast.success("Listing deleted successfully");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to delete listing"
          );
        },
      });
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-1">
              Manage all your e-waste listings
            </p>
          </div>
          <button
            onClick={() => navigate("/user/create-listing")}
            className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-lg font-medium hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New Listing
          </button>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
          </div>
        ) : listingsData?.listings?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listingsData.listings.map((listing, index) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {listing.image_paths && listing.image_paths.length > 0 ? (
                    <img
                      src={getImageUrl(listing.image_paths[0])}
                      alt={listing.productCategory}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      listing.status
                    )}`}
                  >
                    {listing.status?.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {listing.brand} {listing.model}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {listing.productCategory}
                  </p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-brand-green" />
                      <span className="font-semibold text-gray-900">
                        ₹{listing.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({listing.price_type})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(listing.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(listing._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/user/listings/${listing._id}/edit`)
                      }
                      className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      disabled={isDeleting}
                      className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No listings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first listing
            </p>
            <button
              onClick={() => navigate("/user/create-listing")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Listing
            </button>
          </div>
        )}

        {/* Pagination */}
        {listingsData && listingsData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {listingsData.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(listingsData.totalPages, p + 1))
              }
              disabled={page === listingsData.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;
