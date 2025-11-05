import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Package,
  MapPin,
  Eye,
  Loader2,
  Smartphone,
  Star,
  DollarSign,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import { useGetAllListings } from "../../../services/listingService";
import { getImageUrl } from "../../../lib/axios";
import ListingDetailModal from "../components/ListingDetailModal";

const RecyclerListingsPage = () => {
  const navigate = useNavigate();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const limit = 10;

  // Fetch listings
  const { data, isLoading, isError, error } = useGetAllListings(
    currentPage,
    limit,
    "open"
  );

  // Extract unique categories, conditions, and locations from listings
  const { categories, conditions, locations } = useMemo(() => {
    if (!data?.listings) {
      return { categories: [], conditions: [], locations: [] };
    }

    const cats = [
      ...new Set(data.listings.map((l) => l.product_category).filter(Boolean)),
    ];
    const conds = [
      ...new Set(data.listings.map((l) => l.condition).filter(Boolean)),
    ];
    const locs = [
      ...new Set(data.listings.map((l) => l.location).filter(Boolean)),
    ];

    return {
      categories: cats,
      conditions: conds,
      locations: locs,
    };
  }, [data?.listings]);

  // Filter and sort listings
  const filteredAndSortedListings = useMemo(() => {
    if (!data?.listings) return [];

    let filtered = [...data.listings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.product_category?.toLowerCase().includes(query) ||
          listing.brand?.toLowerCase().includes(query) ||
          listing.model?.toLowerCase().includes(query) ||
          listing.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (l) => l.product_category === selectedCategory
      );
    }

    // Condition filter
    if (selectedCondition !== "all") {
      filtered = filtered.filter((l) => l.condition === selectedCondition);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter((l) => l.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter((l) => l.price <= Number(priceRange.max));
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter((l) => l.location === selectedLocation);
    }

    // Sort
    switch (sortBy) {
      case "date-desc":
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "date-asc":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [
    data?.listings,
    searchQuery,
    selectedCategory,
    selectedCondition,
    priceRange,
    selectedLocation,
    sortBy,
  ]);

  const navItems = [
    { label: "Dashboard", path: "/recycler/dashboard" },
    { label: "Browse Listings", path: "/recycler/listings" },
    { label: "My Bids", path: "/recycler/bids" },
    { label: "Certificates", path: "/recycler/certificates" },
  ];

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedListing(null);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setPriceRange({ min: "", max: "" });
    setSelectedLocation("all");
    setSortBy("date-desc");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Listings
          </h1>
          <p className="text-gray-600">
            Find e-waste items available for recycling
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product name, brand, model, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition bg-white"
              />
            </div>

            {/* Sort */}
            <div className="lg:w-56">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white transition appearance-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition font-medium shadow-sm ${
                showFilters
                  ? "bg-green-600 text-white shadow-green-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-green-600" />
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Condition Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-green-600" />
                        Condition
                      </label>
                      <select
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                      >
                        <option value="all">All Conditions</option>
                        {conditions.map((cond) => (
                          <option key={cond} value={cond}>
                            {cond}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        Location
                      </label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                      >
                        <option value="all">All Locations</option>
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Price Range
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: e.target.value,
                            })
                          }
                          className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: e.target.value,
                            })
                          }
                          className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-green-600" />
              Showing{" "}
              <span className="text-green-600 font-bold">
                {filteredAndSortedListings.length}
              </span>{" "}
              of <span className="font-bold">{data?.totalListings || 0}</span>{" "}
              listings
            </p>
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedCondition !== "all" ||
              selectedLocation !== "all") && (
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Filters active
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Listings
            </h3>
            <p className="text-gray-600 mb-4">
              {error?.response?.data?.message || "Failed to fetch listings"}
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
        {!isLoading && !isError && filteredAndSortedListings.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Listings Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ||
              selectedCategory !== "all" ||
              selectedCondition !== "all"
                ? "Try adjusting your filters to see more results"
                : "No listings available at the moment"}
            </p>
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedCondition !== "all") && (
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Listings Grid */}
        {!isLoading && !isError && filteredAndSortedListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAndSortedListings.map((listing, index) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-200"
              >
                {/* Image */}
                <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {listing.image_paths && listing.image_paths.length > 0 ? (
                    <img
                      src={getImageUrl(listing.image_paths[0])}
                      alt={listing.product_category || "Product"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-20 h-20 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-md capitalize">
                    {listing.condition}
                  </div>
                  {listing.price_type === "negotiable" && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-green-600 text-white rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Negotiable
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-green-600 transition">
                        {listing.brand} {listing.model}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {listing.product_category}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {listing.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1.5 text-green-600" />
                    <span className="font-medium">{listing.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {listing.price_type === "negotiable"
                          ? "Starting at"
                          : "Fixed Price"}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ${listing.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(listing)}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading &&
          filteredAndSortedListings.length > 0 &&
          data?.totalPages > 1 && (
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
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default RecyclerListingsPage;
