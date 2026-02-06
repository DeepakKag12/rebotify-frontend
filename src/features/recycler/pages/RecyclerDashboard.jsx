import { motion } from "framer-motion";
import { Recycle, DollarSign, CheckCircle, Clock, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import useAuthStore from "../../../store/authStore";
import { useGetAllListings } from "../../../services/listingService";
import { useGetUserBidHistory } from "../../../services/bidService";
import { useGetUserTransactions } from "../../../services/transactionService";

const RecyclerDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: listingsData, isLoading } = useGetAllListings(1, 10, "open");
  const { data: bidsData } = useGetUserBidHistory(1, 100);
  const { data: transactionsData } = useGetUserTransactions();

  const navItems = [
    { label: "Dashboard", path: "/recycler/dashboard" },
    { label: "Browse Listings", path: "/recycler/listings" },
    { label: "My Bids", path: "/recycler/bids" },
    { label: "Certificates", path: "/recycler/certificates" },
  ];

  // Calculate dynamic stats
  // Recycler purchases items (they are the buyer)
  const completedTransactions = transactionsData?.purchases || [];
  
  const totalEarnings = completedTransactions.reduce((sum, t) => {
    const amount = t.listing?.price || 0;
    return sum + amount;
  }, 0);
  
  // Count pending/active bids
  const pendingBids = bidsData?.bids?.filter(
    (bid) => bid.auctionStatus === "active" && !bid.isWinning
  ) || [];

  const stats = [
    {
      icon: Recycle,
      label: "Items Recycled",
      value: completedTransactions.length.toString(),
      color: "bg-brand-green",
    },
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      color: "bg-blue-500",
    },
    {
      icon: CheckCircle,
      label: "Completed Jobs",
      value: completedTransactions.length.toString(),
      color: "bg-purple-500",
    },
    {
      icon: Clock,
      label: "Total Bids",
      value: (bidsData?.totalBids || 0).toString(),
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Recycle className="w-8 h-8 text-brand-green" />
            Recycler Dashboard - {user?.name}
          </h1>
          <p className="text-gray-600">
            Manage your recycling operations and track your impact.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Available Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Available Listings
          </h2>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading listings...</p>
            </div>
          ) : listingsData?.listings && listingsData.listings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listingsData.listings.slice(0, 5).map((listing) => (
                    <tr key={listing._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-brand-green" />
                          <div>
                            <p className="font-medium text-gray-900">{listing.brand} {listing.model}</p>
                            <p className="text-xs text-gray-500">{listing.manufacture_year || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{listing.product_category}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {listing.location || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">${listing.price}</span>
                        <span className="text-xs text-gray-500 ml-1">({listing.price_type})</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => navigate("/recycler/listings")}
                          className="text-brand-green hover:text-brand-green-dark font-medium text-sm"
                        >
                          View & Bid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No listings available at the moment</p>
              <p className="text-sm text-gray-400 mt-2">
                Check back later for new opportunities!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RecyclerDashboard;
