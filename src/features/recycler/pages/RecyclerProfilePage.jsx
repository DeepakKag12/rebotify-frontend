import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  TrendingDown,
  Receipt as ReceiptIcon,
  Calendar,
  DollarSign,
  Package,
  Eye,
  Printer,
  Truck,
} from "lucide-react";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import Receipt from "../../../shared/components/Receipt";
import { useGetUserTransactions } from "../../../services/transactionService";
import { useGetUserDeliveries } from "../../../services/deliveryService";
import useAuthStore from "../../../store/authStore";
import { getImageUrl } from "../../../lib/axios";

const RecyclerProfilePage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const receiptRef = useRef();

  const { data: transactionsData, isLoading } = useGetUserTransactions();
  const { data: deliveriesData, isLoading: deliveriesLoading } =
    useGetUserDeliveries();

  const navItems = [
    { label: "Dashboard", path: "/recycler/dashboard" },
    { label: "Browse Listings", path: "/recycler/listings" },
    { label: "My Bids", path: "/recycler/bids" },
    { label: "Profile", path: "/recycler/profile" },
  ];

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "purchases", label: "Purchase History", icon: ShoppingCart },
    { id: "deliveries", label: "Deliveries", icon: Truck },
  ];

  const stats = [
    {
      icon: ShoppingCart,
      label: "Total Purchases",
      value: transactionsData?.purchases?.length || 0,
      color: "bg-blue-500",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `$${
        transactionsData?.purchases
          ?.reduce((sum, t) => sum + t.amount, 0)
          .toLocaleString() || 0
      }`,
      color: "bg-purple-500",
    },
  ];

  // Handle print receipt
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${selectedTransaction?.receiptNumber}`,
  });

  const openReceiptModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account and view transaction history
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
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

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 font-medium transition border-b-2 ${
                    activeTab === tab.id
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">
                        {user?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900">
                        {user?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900">
                        {user?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-gray-900">
                        {user?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Purchase History Tab */}
            {activeTab === "purchases" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {isLoading ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-500">Loading transactions...</p>
                  </div>
                ) : transactionsData?.purchases &&
                  transactionsData.purchases.length > 0 ? (
                  transactionsData.purchases.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {transaction.listing?.image_paths?.[0] ? (
                            <img
                              src={getImageUrl(
                                transaction.listing.image_paths[0]
                              )}
                              alt={transaction.listing.product_category}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Transaction Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {transaction.listing?.brand}{" "}
                                {transaction.listing?.model}
                              </h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {transaction.listing?.product_category}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                ${transaction.amount}
                              </p>
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                                Completed
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              Seller: {transaction.seller?.name}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {format(
                                new Date(transaction.transactionDate),
                                "PPP"
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <ReceiptIcon className="w-4 h-4" />
                              {transaction.receiptNumber}
                            </div>
                          </div>

                          <button
                            onClick={() => openReceiptModal(transaction)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Purchases Yet
                    </h3>
                    <p className="text-gray-600">
                      Your purchase history will appear here
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Deliveries Tab */}
            {activeTab === "deliveries" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {deliveriesLoading ? (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 text-gray-300 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-500">Loading deliveries...</p>
                  </div>
                ) : deliveriesData?.purchases &&
                  deliveriesData.purchases.length > 0 ? (
                  deliveriesData.purchases.map((delivery) => (
                    <div
                      key={delivery._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {delivery.orderId?.image_paths?.[0] ? (
                            <img
                              src={getImageUrl(delivery.orderId.image_paths[0])}
                              alt={delivery.orderId.product_category}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Delivery Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {delivery.orderId?.brand}{" "}
                                {delivery.orderId?.model}
                              </h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {delivery.orderId?.product_category}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  delivery.status_delivery === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : delivery.status_delivery === "shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : delivery.status_delivery ===
                                      "outForDelivery"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {delivery.status_delivery === "outForDelivery"
                                  ? "Out for Delivery"
                                  : delivery.status_delivery
                                      .charAt(0)
                                      .toUpperCase() +
                                    delivery.status_delivery.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              Seller: {delivery.sellerId?.name}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              Delivery:{" "}
                              {format(new Date(delivery.deliveryDate), "PPP")}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Truck className="w-4 h-4" />
                              Tracking: {delivery.trackingNumber}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Package className="w-4 h-4" />
                              Order ID: {delivery.orderId?._id?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Deliveries Yet
                    </h3>
                    <p className="text-gray-600">
                      Your deliveries will appear here once you purchase an item
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Action Buttons */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">
                  Transaction Receipt
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={() => {
                      setShowReceiptModal(false);
                      setSelectedTransaction(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Receipt Content */}
              <div className="p-6">
                <div ref={receiptRef}>
                  <Receipt transaction={selectedTransaction} userRole="buyer" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclerProfilePage;
