import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Input from "../../../components/ui/input";
import useListingStore from "../../../store/listingStore";

const Step2ProductDetails = () => {
  const { listingFormData, updateListingField } = useListingStore();

  const productCategories = [
    "Laptop",
    "Mobile Phone",
    "Tablet",
    "Desktop Computer",
    "Television",
    "Monitor",
    "Printer",
    "Scanner",
    "Camera",
    "Gaming Console",
    "Smart Watch",
    "Home Appliance",
    "Other Electronics",
  ];

  const conditions = [
    {
      value: "like-new",
      label: "Like New",
      desc: "Barely used, perfect condition",
    },
    { value: "good", label: "Good", desc: "Used but works perfectly" },
    { value: "fair", label: "Fair", desc: "Shows wear, fully functional" },
    { value: "poor", label: "Poor", desc: "Heavy wear, may have issues" },
    { value: "not-working", label: "Not Working", desc: "For parts or repair" },
  ];

  const accessoriesOptions = [
    "Original Box",
    "Charger/Adapter",
    "Cables",
    "Manual/Documentation",
    "Original Receipt",
    "Carrying Case",
    "Screen Protector",
    "Warranty Card",
  ];

  const handleChange = (field, value) => {
    updateListingField(field, value);
  };

  const toggleAccessory = (accessory) => {
    const currentAccessories = listingFormData.accessories
      ? listingFormData.accessories.split(", ")
      : [];

    if (currentAccessories.includes(accessory)) {
      const newAccessories = currentAccessories.filter((a) => a !== accessory);
      handleChange("accessories", newAccessories.join(", "));
    } else {
      handleChange(
        "accessories",
        [...currentAccessories, accessory].join(", ")
      );
    }
  };

  const isAIFilled = listingFormData.aiAnalysisResult !== null;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Product Details
        </h2>
        <p className="text-gray-600">
          {isAIFilled
            ? "Review and edit the auto-filled information"
            : "Provide detailed information about your product"}
        </p>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Basic Information
          {isAIFilled && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Filled
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Category <span className="text-red-500">*</span>
            </label>
            <select
              value={listingFormData.productCategory}
              onChange={(e) => handleChange("productCategory", e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {productCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <Input
            label="Brand"
            type="text"
            placeholder="e.g., Apple, Samsung, Dell"
            value={listingFormData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            required
          />

          {/* Model */}
          <Input
            label="Model Name/Number"
            type="text"
            placeholder="e.g., iPhone 13 Pro, ThinkPad X1"
            value={listingFormData.model}
            onChange={(e) => handleChange("model", e.target.value)}
          />

          {/* Manufacture Year */}
          <Input
            label="Year of Manufacture"
            type="number"
            placeholder="e.g., 2020"
            value={listingFormData.manufacture_year}
            onChange={(e) => handleChange("manufacture_year", e.target.value)}
            min="1990"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Condition <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {conditions.map((condition) => (
            <motion.button
              key={condition.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChange("condition", condition.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                listingFormData.condition === condition.value
                  ? "border-brand-green bg-brand-green/5"
                  : "border-gray-200 hover:border-brand-green/50"
              }`}
            >
              <p className="font-semibold text-gray-900 text-sm">
                {condition.label}
              </p>
              <p className="text-xs text-gray-500 mt-1">{condition.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Product Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={listingFormData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe your product in detail. Include specifications, condition, any defects, reason for selling, etc."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none"
          rows={6}
          maxLength={500}
          required
        />
        <p className="text-xs text-gray-500 mt-1.5 text-right">
          {listingFormData.description.length}/500 characters
        </p>
      </div>

      {/* Accessories Included */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Accessories Included
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {accessoriesOptions.map((accessory) => {
            const isSelected = listingFormData.accessories
              .split(", ")
              .includes(accessory);
            return (
              <button
                key={accessory}
                onClick={() => toggleAccessory(accessory)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-gray-200 text-gray-700 hover:border-brand-green"
                }`}
              >
                {accessory}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Battery Health */}
        <Input
          label="Battery Health/Condition"
          type="text"
          placeholder="e.g., 85%, Good, Replaced"
          value={listingFormData.battery}
          onChange={(e) => handleChange("battery", e.target.value)}
        />

        {/* Video Link */}
        <Input
          label="Video Link (Optional)"
          type="url"
          placeholder="https://youtube.com/..."
          value={listingFormData.video_link}
          onChange={(e) => handleChange("video_link", e.target.value)}
        />
      </div>
    </div>
  );
};

export default Step2ProductDetails;
