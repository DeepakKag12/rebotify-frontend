import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../../components/ui/input";
import useListingStore from "../../../store/listingStore";
import useAuthStore from "../../../store/authStore";
import { useUpdateUserAddress } from "../../../services/authService";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateOptionalPhone,
  validateAddress,
  validateLocation,
} from "../../../utils/validationSchemas";

const Step4ContactAddress = () => {
  const { user } = useAuthStore();
  const { listingFormData, updateListingField } = useListingStore();
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    location: "",
  });
  const [errors, setErrors] = useState({});

  // Use the update address hook
  const { mutate: updateUserAddress, isPending: isAddingAddress } =
    useUpdateUserAddress();

  // Get addresses from user profile
  const userAddresses = user?.addresses || [];

  // Debug: Log to see what we have
  console.log("User:", user);
  console.log("User Addresses:", userAddresses);

  const handleChange = (field, value) => {
    updateListingField(field, value);
  };

  // Real-time validation handlers
  const handleNameChange = async (e) => {
    const { value } = e.target;
    handleChange("name", value);
    const error = await validateName(value);
    setErrors((prev) => ({ ...prev, name: error }));
  };

  const handleEmailChange = async (e) => {
    const { value } = e.target;
    handleChange("email", value);
    const error = await validateEmail(value);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handlePhoneChange = async (e) => {
    const { value } = e.target;
    handleChange("phone", value);
    const error = await validatePhone(value);
    setErrors((prev) => ({ ...prev, phone: error }));
  };

  const handleWhatsappChange = async (e) => {
    const { value } = e.target;
    handleChange("whatsapp", value);
    const error = await validateOptionalPhone(value);
    setErrors((prev) => ({ ...prev, whatsapp: error }));
  };

  const selectAddress = (addressObj) => {
    // Backend model has { address: "string" } structure
    const addressText = addressObj.address || addressObj;
    handleChange("address", addressText);
    handleChange("location", addressText);
  };

  const handleAddNewAddress = () => {
    if (!newAddress.address || !newAddress.location) {
      toast.error("Please fill in all address fields");
      return;
    }

    // Call API to add address to user profile
    updateUserAddress(
      {
        userId: user.id || user._id,
        addressData: { address: newAddress.address },
      },
      {
        onSuccess: (data) => {
          toast.success("Address added successfully!");
          // Use the newly added address for the listing
          handleChange("address", newAddress.address);
          handleChange("location", newAddress.location);
          // Close modal and reset form
          setShowAddAddressModal(false);
          setNewAddress({ address: "", location: "" });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to add address");
        },
      }
    );
  };

  const contactMethods = [
    { value: "phone", label: "Phone Call", icon: Phone },
    { value: "whatsapp", label: "WhatsApp", icon: Phone },
    { value: "email", label: "Email", icon: Mail },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Contact & Pickup Address
        </h2>
        <p className="text-gray-600">
          Provide your contact details and select a pickup address
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name (Pre-filled) */}
          <Input
            label="Full Name"
            type="text"
            value={listingFormData.name || user?.name}
            onChange={handleNameChange}
            error={errors.name}
            placeholder="Your full name"
            required
            disabled
            className="bg-gray-50"
          />

          {/* Email (Pre-filled) */}
          <Input
            label="Email Address"
            type="email"
            value={listingFormData.email || user?.email}
            onChange={handleEmailChange}
            error={errors.email}
            placeholder="your@email.com"
            required
            disabled
            className="bg-gray-50"
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            type="tel"
            value={listingFormData.phone}
            onChange={handlePhoneChange}
            error={errors.phone}
            placeholder="+91 98765 43210"
            required
          />

          {/* Alternate Phone (Optional) */}
          <Input
            label="WhatsApp Number (Optional)"
            type="tel"
            value={listingFormData.whatsapp}
            onChange={handleWhatsappChange}
            error={errors.whatsapp}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      {/* Address Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Select Pickup Address <span className="text-red-500">*</span>
          </h3>
          <button
            onClick={() => setShowAddAddressModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-green border-2 border-brand-green rounded-lg hover:bg-brand-green hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        {/* Address Cards */}
        {userAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userAddresses.map((addr, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectAddress(addr)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  listingFormData.address === addr.address
                    ? "border-brand-green bg-brand-green/5"
                    : "border-gray-200 hover:border-brand-green/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-green" />
                    <span className="font-semibold text-gray-900">
                      Address {index + 1}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      listingFormData.address === addr.address
                        ? "border-brand-green bg-brand-green"
                        : "border-gray-300"
                    }`}
                  >
                    {listingFormData.address === addr.address && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{addr.address}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">No saved addresses</p>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="text-brand-green font-medium hover:underline"
            >
              Add your first address
            </button>
          </div>
        )}
      </div>

      {/* Contact Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Preferred Contact Method <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {contactMethods.map((method) => (
            <motion.button
              key={method.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChange("contact_preference", method.value)}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                listingFormData.contact_preference === method.value
                  ? "border-brand-green bg-brand-green/5"
                  : "border-gray-200 hover:border-brand-green/50"
              }`}
            >
              <method.icon className="w-5 h-5 text-brand-green" />
              <span className="font-medium text-gray-900">{method.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddAddressModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddAddressModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Add New Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Address
                    </label>
                    <textarea
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address: e.target.value,
                        })
                      }
                      placeholder="House No., Street, Area, City, State, Pincode"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location/City
                    </label>
                    <input
                      type="text"
                      value={newAddress.location}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., Mumbai, Maharashtra"
                      className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowAddAddressModal(false)}
                      disabled={isAddingAddress}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNewAddress}
                      disabled={
                        !newAddress.address ||
                        !newAddress.location ||
                        isAddingAddress
                      }
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        newAddress.address &&
                        newAddress.location &&
                        !isAddingAddress
                          ? "bg-brand-green text-white hover:bg-green-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isAddingAddress ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Address"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Info Box */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
          📍 Privacy & Safety
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Your exact address will only be shared with verified buyers</li>
          <li>• We recommend meeting in safe, public places for pickup</li>
          <li>• Your contact information is encrypted and secure</li>
        </ul>
      </div>
    </div>
  );
};

export default Step4ContactAddress;
