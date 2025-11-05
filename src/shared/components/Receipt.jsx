import { forwardRef } from "react";
import { format } from "date-fns";
import {
  CheckCircle,
  Package,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Receipt = forwardRef(({ transaction, userRole }, ref) => {
  if (!transaction) return null;

  const isUserSeller = userRole === "seller";
  const otherParty = isUserSeller ? transaction.buyer : transaction.seller;
  const otherPartyLabel = isUserSeller ? "Buyer" : "Seller";

  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-green-600 pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Rebot</h1>
            </div>
            <p className="text-sm text-gray-600">E-Waste Recycling Platform</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">RECEIPT</h2>
            <p className="text-sm text-gray-600">
              Receipt #: {transaction.receiptNumber}
            </p>
            <p className="text-sm text-gray-600">
              Date: {format(new Date(transaction.transactionDate), "PPP")}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <span className="text-lg font-semibold text-green-800">
            Transaction Completed Successfully
          </span>
        </div>
      </div>

      {/* Parties Information */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Seller Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            Seller Information
          </h3>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900">
              {isUserSeller ? "You" : transaction.seller?.name || "N/A"}
            </p>
            {!isUserSeller && transaction.seller?.email && (
              <p className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4" />
                {transaction.seller.email}
              </p>
            )}
            {!isUserSeller && transaction.seller?.phone && (
              <p className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4" />
                {transaction.seller.phone}
              </p>
            )}
          </div>
        </div>

        {/* Buyer Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            Buyer Information
          </h3>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-gray-900">
              {!isUserSeller ? "You" : transaction.buyer?.name || "N/A"}
            </p>
            {isUserSeller && transaction.buyer?.email && (
              <p className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4" />
                {transaction.buyer.email}
              </p>
            )}
            {isUserSeller && transaction.buyer?.phone && (
              <p className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4" />
                {transaction.buyer.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-green-600" />
          Product Details
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-900">
                    {transaction.listing?.brand} {transaction.listing?.model}
                  </p>
                  {transaction.listing?.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {transaction.listing.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4 text-gray-700 capitalize">
                  {transaction.listing?.product_category || "N/A"}
                </td>
                <td className="px-4 py-4 text-right font-bold text-gray-900">
                  ${transaction.amount?.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Amount */}
      <div className="border-t-2 border-gray-300 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">Total Amount:</span>
          <span className="text-3xl font-bold text-green-600">
            ${transaction.amount?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-3">Transaction Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Transaction Date:</span>
            <span className="font-semibold text-gray-900">
              {format(new Date(transaction.transactionDate), "PPpp")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Status:</span>
            <span className="font-semibold text-green-600 capitalize">
              {transaction.status}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Thank you for using Rebot E-Waste Recycling Platform
        </p>
        <p className="text-xs text-gray-500">
          This is a digitally generated receipt. For any queries, please contact
          support.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Generated on {format(new Date(), "PPpp")}
        </p>
      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
