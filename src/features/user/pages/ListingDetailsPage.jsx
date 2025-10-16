import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { toast } from "react-toastify";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import { getImageUrl } from "../../../lib/axios";
import {
  useGetListing,
  useDeleteListing,
} from "../../../services/listingService";

const ListingDetailsPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const { data: listingData, isLoading } = useGetListing(listingId);
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Create Listing", path: "/user/create-listing" },
    { label: "My Listings", path: "/user/listings" },
  ];

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
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Bids Received
              </h2>
              {listing.bids && listing.bids.length > 0 ? (
                <div className="space-y-3">
                  {listing.bids.map((bid, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-brand-green transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {bid.bidderName || "Anonymous Bidder"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(bid.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-brand-green">
                            ₹{bid.amount?.toLocaleString()}
                          </p>
                          <span className="text-xs text-gray-500">
                            {bid.status}
                          </span>
                        </div>
                      </div>
                      {bid.message && (
                        <p className="mt-2 text-sm text-gray-600">
                          {bid.message}
                        </p>
                      )}
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
                  ₹{listing.price?.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {listing.price_type}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Delivery Options</p>
                <div className="space-y-2">
                  {listing.delivery?.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle className="w-4 h-4 text-brand-green" />
                      <span className="capitalize">{option}</span>
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
    </div>
  );
};

export default ListingDetailsPage;
