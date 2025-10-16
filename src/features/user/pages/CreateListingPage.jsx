import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useCreateListing } from "../../../services/listingService";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentStep, setCurrentStep, listingFormData, resetListingForm } =
    useListingStore();

  const { mutate: createListing, isPending } = useCreateListing();

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Create Listing", path: "/user/create-listing" },
    { label: "My Listings", path: "/user/listings" },
  ];

  const steps = [
    { number: 1, label: "Upload Images" },
    { number: 2, label: "Product Details" },
    { number: 3, label: "Pricing" },
    { number: 4, label: "Contact & Address" },
  ];

  const [canProceed, setCanProceed] = useState(false);

  // Validation for each step
  useEffect(() => {
    switch (currentStep) {
      case 1:
        setCanProceed(
          listingFormData.images.length > 0 &&
            listingFormData.aiAnalysisResult !== null
        );
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
      toast.error("Please fill all required fields");
      return;
    }

    // Prepare form data for submission
    const formData = new FormData();

    // Add images
    listingFormData.images.forEach((image) => {
      formData.append("images", image);
    });

    // Add all other fields (matching backend expectations)
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

    createListing(formData, {
      onSuccess: (data) => {
        toast.success("Listing created successfully! 🎉");
        resetListingForm();
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 2000);
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to create listing"
        );
      },
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1UploadImages />;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/user/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-green mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Listing
          </h1>
          <p className="text-gray-600 mt-2">
            Follow the steps below to list your e-waste for recycling
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
                  ? "bg-brand-green text-white hover:bg-green-600 shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Listing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
