import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";
import ProgressStepper from "../components/ProgressStepper";
import Step1UploadImages from "../components/Step1UploadImages";
import Step2ProductDetails from "../components/Step2ProductDetails";
import Step3Pricing from "../components/Step3Pricing";
import Step4ContactAddress from "../components/Step4ContactAddress";
import useListingStore from "../../../store/listingStore";
import useAuthStore from "../../../store/authStore";
import {
  useGetListing,
  useUpdateListing,
} from "../../../services/listingService";

const EditListingPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentStep,
    setCurrentStep,
    listingFormData,
    setListingFormData,
    resetListingForm,
  } = useListingStore();

  const { data: listingData, isLoading: isLoadingListing } =
    useGetListing(listingId);
  const { mutate: updateListing, isPending } = useUpdateListing();

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "My Listings", path: "/user/listings" },
    { label: "Edit Listing", path: `/user/listings/${listingId}/edit` },
  ];

  const steps = [
    { number: 1, label: "Upload Images" },
    { number: 2, label: "Product Details" },
    { number: 3, label: "Pricing" },
    { number: 4, label: "Contact & Address" },
  ];

  const [canProceed, setCanProceed] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load existing listing data into the form
  useEffect(() => {
    if (listingData?.listing && !isDataLoaded) {
      const listing = listingData.listing;

      setListingFormData({
        productCategory: listing.product_category || "",
        brand: listing.brand || "",
        model: listing.model || "",
        manufacture_year: listing.manufacture_year || "",
        condition: listing.condition || "",
        description: listing.description || "",
        accessories: listing.accessories || "",
        battery: listing.battery || "",
        video_link: listing.video_link || "",
        price: listing.price || "",
        price_type: listing.price_type || "fixed",
        delivery_options: listing.delivery_options
          ? listing.delivery_options.split(", ").filter(Boolean)
          : [],
        name: listing.name || user?.name || "",
        email: listing.email || user?.email || "",
        phone: listing.phone || "",
        contact_preference: listing.contact_preference || "phone",
        location: listing.location || "",
        address: listing.address || "",
        // Note: Images will remain empty as we can't pre-fill file inputs
        images: [],
        aiAnalysisResult: null,
      });

      setIsDataLoaded(true);
    }
  }, [listingData, isDataLoaded, setListingFormData, user]);

  // Validation for each step
  useEffect(() => {
    switch (currentStep) {
      case 1:
        // For editing, allow proceeding without new images
        setCanProceed(true);
        break;
      case 2:
        setCanProceed(
          listingFormData.productCategory &&
            listingFormData.brand &&
            listingFormData.condition &&
            listingFormData.description.length >= 20
        );
        break;
      case 3:
        setCanProceed(
          listingFormData.price > 0 &&
            listingFormData.delivery_options.length > 0
        );
        break;
      case 4:
        setCanProceed(
          listingFormData.phone &&
            listingFormData.address &&
            listingFormData.location &&
            listingFormData.contact_preference
        );
        break;
      default:
        setCanProceed(false);
    }
  }, [currentStep, listingFormData]);

  const handleNext = () => {
    if (canProceed && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!canProceed) {
      toast.error("Please complete all required fields");
      return;
    }

    const formData = new FormData();

    // Add images only if new ones were uploaded
    if (listingFormData.images.length > 0) {
      listingFormData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Add all other fields
    formData.append("productCategory", listingFormData.productCategory);
    formData.append("brand", listingFormData.brand);
    formData.append("model", listingFormData.model);
    formData.append("manufacture_year", listingFormData.manufacture_year);
    formData.append("condition", listingFormData.condition);
    formData.append("description", listingFormData.description);
    formData.append("accessories", listingFormData.accessories);
    formData.append("battery", listingFormData.battery);
    formData.append("video_link", listingFormData.video_link);
    formData.append("price", listingFormData.price);
    formData.append("price_type", listingFormData.price_type);

    // Delivery options as array
    listingFormData.delivery_options.forEach((option) => {
      formData.append("delivery", option);
    });

    formData.append("name", listingFormData.name || user?.name);
    formData.append("email", listingFormData.email || user?.email);
    formData.append("phone", listingFormData.phone);
    formData.append("contact_preference", listingFormData.contact_preference);
    formData.append("location", listingFormData.location);
    formData.append("address", listingFormData.address);

    updateListing(
      { listingId, formData },
      {
        onSuccess: (data) => {
          toast.success("Listing updated successfully!");
          resetListingForm();
          setTimeout(() => {
            navigate(`/user/listings/${listingId}`);
          }, 1500);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update listing"
          );
        },
      }
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1UploadImages isEditMode={true} />;
      case 2:
        return <Step2ProductDetails />;
      case 3:
        return <Step3Pricing />;
      case 4:
        return <Step4ContactAddress />;
      default:
        return null;
    }
  };

  if (isLoadingListing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar navItems={navItems} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">
            Edit Your Listing
          </h1>
          <p className="text-gray-600 mt-2">
            Update your e-waste listing information
          </p>
        </motion.div>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} steps={steps} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-gray-300 text-gray-700 hover:border-brand-green hover:text-brand-green"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
                canProceed
                  ? "bg-brand-green text-white hover:bg-green-600 shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isPending}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
                canProceed && !isPending
                  ? "bg-gradient-to-r from-brand-green to-green-600 text-white hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Update Listing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;
