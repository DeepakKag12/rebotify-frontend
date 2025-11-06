import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Plus, Loader2, Check } from "lucide-react";
import { toast } from "react-toastify";
import useAuthStore from "../../../store/authStore";

const AddressSelectionModal = ({ onClose, onAddressSelected }) => {
  const { user, updateUser } = useAuthStore();
  const [selectedAddress, setSelectedAddress] = useState(
    user?.addresses?.[0]?._id || null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddAddress = async () => {
    if (!newAddress.trim()) {
      toast.error("Please enter an address");
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/address/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({ address: newAddress }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add address");
      }

      // Update user in auth store
      updateUser({ addresses: data.addresses });

      toast.success("Address added successfully!");
      setNewAddress("");
      setShowAddForm(false);

      // Auto-select the newly added address
      const newAddressId = data.addresses[data.addresses.length - 1]._id;
      setSelectedAddress(newAddressId);
    } catch (error) {
      toast.error(error.message || "Failed to add address");
    } finally {
      setIsAdding(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    const address = user?.addresses?.find((a) => a._id === selectedAddress);
    if (address) {
      onAddressSelected(address);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-full">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Select Delivery Address
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose where you want the item delivered
                </p>
              </div>
            </div>
          </div>

          {/* Address List */}
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {user?.addresses?.length > 0 ? (
              user.addresses.map((address) => (
                <motion.div
                  key={address._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAddress === address._id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedAddress(address._id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        selectedAddress === address._id
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAddress === address._id && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        {address.address}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No addresses added yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add an address to continue
                </p>
              </div>
            )}
          </div>

          {/* Add New Address Section */}
          <AnimatePresence>
            {showAddForm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Address
                  </label>
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter your complete delivery address..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 bg-white placeholder-gray-400"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddAddress}
                      disabled={isAdding || !newAddress.trim()}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Address
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewAddress("");
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAddForm(true)}
                className="w-full mb-6 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Address
              </motion.button>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAddress}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Address
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddressSelectionModal;
