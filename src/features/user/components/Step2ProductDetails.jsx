import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Input from "../../../components/ui/input";
import useListingStore from "../../../store/listingStore";
import {
  validateBrand,
  validateModel,
  validateYear,
  validateDescription,
  validateBattery,
  validateVideoLink,
} from "../../../utils/validationSchemas";

const Step2ProductDetails = () => {
  const { listingFormData, updateListingField } = useListingStore();
  const [errors, setErrors] = useState({});

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

  // Real-time validation handlers
  const handleBrandChange = async (e) => {
    const { value } = e.target;
    handleChange("brand", value);
    const error = await validateBrand(value);
    setErrors((prev) => ({ ...prev, brand: error }));
  };

  const handleModelChange = async (e) => {
    const { value } = e.target;
    handleChange("model", value);
    const error = await validateModel(value);
    setErrors((prev) => ({ ...prev, model: error }));
  };

  const handleYearChange = async (e) => {
    const { value } = e.target;
    handleChange("manufacture_year", value);
    const error = await validateYear(Number(value));
    setErrors((prev) => ({ ...prev, manufacture_year: error }));
  };

  const handleDescriptionChange = async (e) => {
    const { value } = e.target;
    handleChange("description", value);
    const error = await validateDescription(value);
    setErrors((prev) => ({ ...prev, description: error }));
  };

  const handleBatteryChange = async (e) => {
    const { value } = e.target;
    handleChange("battery", value);
    const error = await validateBattery(value);
    setErrors((prev) => ({ ...prev, battery: error }));
  };

  const handleVideoLinkChange = async (e) => {
    const { value } = e.target;
    handleChange("video_link", value);
    const error = await validateVideoLink(value);
    setErrors((prev) => ({ ...prev, video_link: error }));
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
            onChange={handleBrandChange}
            error={errors.brand}
            required
          />

          {/* Model */}
          <Input
            label="Model Name/Number"
            type="text"
            placeholder="e.g., iPhone 13 Pro, ThinkPad X1"
            value={listingFormData.model}
            onChange={handleModelChange}
            error={errors.model}
          />

          {/* Manufacture Year */}
          <Input
            label="Year of Manufacture"
            type="number"
            placeholder="e.g., 2020"
            value={listingFormData.manufacture_year}
            onChange={handleYearChange}
            error={errors.manufacture_year}
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
          onChange={handleDescriptionChange}
          placeholder="Describe your product in detail. Include specifications, condition, any defects, reason for selling, etc."
          className={`w-full rounded-lg border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
            errors.description ? "focus:ring-red-500" : "focus:ring-brand-green"
          } focus:border-transparent resize-none`}
          rows={6}
          maxLength={1000}
          required
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.description && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.description}
            </p>
          )}
          <p
            className={`text-xs ${
              errors.description ? "text-red-500" : "text-gray-500"
            } ml-auto`}
          >
            {listingFormData.description.length}/1000 characters
          </p>
        </div>
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
          onChange={handleBatteryChange}
          error={errors.battery}
        />

        {/* Video Link */}
        <Input
          label="Video Link (Optional)"
          type="url"
          placeholder="https://youtube.com/..."
          value={listingFormData.video_link}
          onChange={handleVideoLinkChange}
          error={errors.video_link}
        />
      </div>
    </div>
  );
};

export default Step2ProductDetails;
