import { motion } from "framer-motion";
import {
  Package,
  TrendingUp,
  Award,
  MapPin,
  Plus,
  FileText,
  History,
  Settings,
  Recycle,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import useAuthStore from "../../../store/authStore";
import { useGetSellerListings } from "../../../services/listingService";
import { useGetUserTransactions } from "../../../services/transactionService";

const UserDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Fetch user's open listings from backend
  const { data: listingsData } = useGetSellerListings(1, 10);
  // Fetch transactions to get completed deals (sales)
  const { data: transactionsData } = useGetUserTransactions();

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Create Listing", path: "/user/create-listing" },
    { label: "My Listings", path: "/user/listings" },
  ];
  
  // Get open and closed listings counts
  const openListings = listingsData?.listings || [];
  const closedListings = transactionsData?.sales || [];
  const totalListings = openListings.length + closedListings.length;
  
  const stats = [
    {
      icon: Package,
      label: "Total Listings",
      value: totalListings.toString(),
      color: "bg-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Active Listings",
      value: openListings.length.toString(),
      color: "bg-brand-green",
    },
    {
      icon: Award,
      label: "Completed Deals",
      value: closedListings.length.toString(),
      color: "bg-purple-500",
    },
    {
      icon: ShoppingBag,
      label: "Total Bids",
      value: closedListings.length.toString(),
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Create New Listing",
      description: "Sell your e-waste items easily",
      color: "bg-brand-green",
      hoverColor: "hover:bg-brand-green/90",
      path: "/user/create-listing",
    },
    {
      icon: FileText,
      title: "Browse Recyclers",
      description: "Find certified recycling partners",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      path: "/user/recyclers",
    },
    {
      icon: History,
      title: "Track Deliveries",
      description: "Monitor your pickup & delivery status",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      path: "/user/deliveries",
    },
    {
      icon: Settings,
      title: "Manage Profile",
      description: "Update your account settings",
      color: "bg-gray-600",
      hoverColor: "hover:bg-gray-700",
      path: "/user/profile",
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your e-waste management today.
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

        {/* Big Create Listing Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => navigate("/user/create-listing")}
          className="w-full bg-gradient-to-r from-brand-green to-green-600 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-8 flex items-center justify-center gap-3"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xl font-semibold">Create New Listing</span>
        </motion.button>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Listings
          </h2>
          {(() => {
            // Combine open listings and closed listings from transactions
            const openListingsToShow = openListings.slice(0, 5);
            const closedListingsFromSales = closedListings.map(sale => ({
              _id: sale.listing?._id,
              brand: sale.listing?.brand,
              model: sale.listing?.model,
              product_category: sale.listing?.product_category,
              price: sale.amount,
              price_type: "fixed",
              status: "closed",
            }));
            const combinedListings = [...openListingsToShow, ...closedListingsFromSales].slice(0, 5);
            
            return combinedListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedListings.map((listing) => (
                      <tr key={listing._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-brand-green" />
                            <div>
                              <p className="font-medium text-gray-900">{listing.brand} {listing.model}</p>
                              <p className="text-xs text-gray-500">{listing.product_category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{listing.product_category}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900">${listing.price}</span>
                          <span className="text-xs text-gray-500 ml-1">({listing.price_type})</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'open' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/user/listings/${listing._id}`)}
                            className="text-brand-green hover:text-brand-green-dark font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No listings yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Start by creating your first listing!
                </p>
              </div>
            );
          })()}
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
