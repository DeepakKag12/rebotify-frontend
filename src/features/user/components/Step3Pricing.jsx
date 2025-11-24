import { useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Sparkles, TrendingUp } from "lucide-react";
import Input from "../../../components/ui/input";
import useListingStore from "../../../store/listingStore";
import { validatePrice } from "../../../utils/validationSchemas";

const Step3Pricing = () => {
  const { listingFormData, updateListingField } = useListingStore();
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    updateListingField(field, value);
  };

  // Real-time validation for price
  const handlePriceChange = async (e) => {
    const { value } = e.target;
    handleChange("price", value);
    const error = await validatePrice(Number(value));
    setErrors((prev) => ({ ...prev, price: error }));
  };

  const toggleDeliveryOption = (option) => {
    const currentOptions = listingFormData.delivery_options || [];
    if (currentOptions.includes(option)) {
      handleChange(
        "delivery_options",
        currentOptions.filter((o) => o !== option)
      );
    } else {
      handleChange("delivery_options", [...currentOptions, option]);
    }
  };

  const aiSuggestedPrice =
    listingFormData.aiAnalysisResult?.analysis?.estimated_price_range;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pricing & Delivery
        </h2>
        <p className="text-gray-600">Set your price and delivery options</p>
      </div>

      {/* AI Price Suggestion */}
      {aiSuggestedPrice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 text-lg mb-1">
                AI Price Suggestion
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                Based on market analysis and product condition
              </p>
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3">
                <IndianRupee className="w-5 h-5 text-brand-green" />
                <span className="text-2xl font-bold text-gray-900">
                  {aiSuggestedPrice.min?.toLocaleString("en-IN")}
                </span>
                <span className="text-gray-500">-</span>
                <span className="text-2xl font-bold text-gray-900">
                  {aiSuggestedPrice.max?.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {listingFormData.aiAnalysisResult?.user_guidance
                  ?.pricing_guidance || "Suggested price range"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Price Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Set Your Price <span className="text-red-500">*</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expected Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Expected Price (₹)
            </label>
            <div className="relative">
              <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={listingFormData.price}
                onChange={handlePriceChange}
                placeholder="25000"
                className={`w-full h-11 rounded-lg border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.price ? "focus:ring-red-500" : "focus:ring-brand-green"
                } focus:border-transparent`}
                min="0"
                step="0.01"
                required
              />
            </div>
            {errors.price && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.price}
              </p>
            )}
          </div>

          {/* Price Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Price Type
            </label>
            <select
              value={listingFormData.price_type}
              onChange={(e) => handleChange("price_type", e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            >
              <option value="fixed">Fixed Price</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>
        </div>

        {listingFormData.price && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <TrendingUp className="w-5 h-5 text-brand-green" />
              <span className="font-medium">
                Your asking price: ₹
                {parseInt(listingFormData.price).toLocaleString("en-IN")}
              </span>
              {listingFormData.price_type === "negotiable" && (
                <span className="text-sm text-gray-500">(Negotiable)</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delivery Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Delivery Options <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600 -mt-2">
          Select at least one delivery method
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup Available */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleDeliveryOption("pickup")}
            className={`p-6 rounded-xl border-2 text-left transition-all ${
              listingFormData.delivery_options.includes("pickup")
                ? "border-brand-green bg-brand-green/5"
                : "border-gray-200 hover:border-brand-green/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  🚗 Pickup Available
                </h4>
                <p className="text-sm text-gray-600">
                  Buyer can collect from your location
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  listingFormData.delivery_options.includes("pickup")
                    ? "border-brand-green bg-brand-green"
                    : "border-gray-300"
                }`}
              >
                {listingFormData.delivery_options.includes("pickup") && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
            </div>
          </motion.button>

          {/* Delivery Available */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleDeliveryOption("delivery")}
            className={`p-6 rounded-xl border-2 text-left transition-all ${
              listingFormData.delivery_options.includes("delivery")
                ? "border-brand-green bg-brand-green/5"
                : "border-gray-200 hover:border-brand-green/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  📦 Delivery Available
                </h4>
                <p className="text-sm text-gray-600">
                  You'll arrange delivery to buyer
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  listingFormData.delivery_options.includes("delivery")
                    ? "border-brand-green bg-brand-green"
                    : "border-gray-300"
                }`}
              >
                {listingFormData.delivery_options.includes("delivery") && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
            </div>
          </motion.button>
        </div>

        {listingFormData.delivery_options.length === 0 && (
          <p className="text-sm text-red-500">
            ⚠️ Please select at least one delivery option
          </p>
        )}
      </div>

      {/* Pricing Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          💡 Pricing Tips
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Research similar items to set a competitive price</li>
          <li>• Consider the condition and age of your product</li>
          <li>• "Negotiable" prices may attract more buyers</li>
          <li>• Include all accessories for better value</li>
          <li>• Offering both pickup and delivery increases chances</li>
        </ul>
      </div>
    </div>
  );
};

export default Step3Pricing;
