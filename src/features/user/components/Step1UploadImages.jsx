import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import ImageUpload from "./ImageUpload";
import useListingStore from "../../../store/listingStore";
import { useAnalyzeImages } from "../../../services/listingService";

const Step1UploadImages = ({ isEditMode = false }) => {
  const { listingFormData, updateListingField } = useListingStore();
  const { mutate: analyzeImages, isPending: isAnalyzing } = useAnalyzeImages();
  const [hasAnalyzed, setHasAnalyzed] = useState(
    !!listingFormData.aiAnalysisResult
  );

  const handleImagesChange = (newImages) => {
    updateListingField("images", newImages);
    setHasAnalyzed(false);
  };

  const handleAnalyze = () => {
    if (listingFormData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    listingFormData.images.forEach((image) => {
      formData.append("images", image);
    });

    analyzeImages(formData, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success("AI Analysis completed! Form auto-filled");
          setHasAnalyzed(true);
        } else {
          toast.error(data.message || "AI Analysis failed");
        }
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to analyze images"
        );
      },
    });
  };

  const analysisResult = listingFormData.aiAnalysisResult;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditMode ? "Update Product Images" : "Upload Product Images"}
        </h2>
        <p className="text-gray-600">
          {isEditMode
            ? "Upload new photos to replace existing ones, or skip to keep current images."
            : "Upload clear photos of your e-waste item. Our AI will automatically analyze and fill product details."}
        </p>
      </div>

      {/* Image Upload */}
      <ImageUpload
        images={listingFormData.images}
        onImagesChange={handleImagesChange}
        maxImages={5}
      />

      {isEditMode && listingFormData.images.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            ℹ️ No new images uploaded. Your existing images will be kept
            unchanged.
          </p>
        </div>
      )}

      {/* AI Analysis Button */}
      {listingFormData.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || hasAnalyzed}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-md ${
              hasAnalyzed
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : isAnalyzing
                ? "bg-gray-200 text-gray-500 cursor-wait"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                AI is analyzing your images...
              </>
            ) : hasAnalyzed ? (
              <>
                <Sparkles className="w-6 h-6" />
                <span className="flex items-center gap-2">Analysis Complete <CheckCircle className="w-5 h-5" /></span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Analyze with AI Magic
              </>
            )}
          </button>

          {!hasAnalyzed && !isAnalyzing && (
            <p className="text-sm text-gray-500 text-center">
              Click to let AI automatically fill product details from your
              images
            </p>
          )}
        </motion.div>
      )}

      {/* AI Analysis Result */}
      {hasAnalyzed && analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 text-lg mb-1">
                AI Analysis Results
              </h3>
              <p className="text-purple-700 text-sm">
                {analysisResult.user_guidance?.confidence_message ||
                  "Form has been auto-filled with detected information"}
              </p>
            </div>
          </div>

          {/* Analysis Details */}
          {analysisResult.analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {analysisResult.analysis.product_category && (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-gray-900">
                    {analysisResult.analysis.product_category}
                  </p>
                </div>
              )}
              {analysisResult.analysis.brand && (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Brand</p>
                  <p className="font-medium text-gray-900">
                    {analysisResult.analysis.brand}
                  </p>
                </div>
              )}
              {analysisResult.analysis.condition && (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Condition</p>
                  <p className="font-medium text-gray-900">
                    {analysisResult.analysis.condition}
                  </p>
                </div>
              )}
              {analysisResult.analysis.estimated_price_range && (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Estimated Price</p>
                  <p className="font-medium text-gray-900">
                    ${analysisResult.analysis.estimated_price_range.min} - $
                    {analysisResult.analysis.estimated_price_range.max}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Next Steps */}
          {analysisResult.user_guidance?.next_steps && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Next Steps:
              </p>
              <ul className="space-y-1">
                {analysisResult.user_guidance.next_steps.map((step, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Requirements */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 mb-1">
            Image Requirements:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Upload at least 1 image (maximum 5)</li>
            <li>• Use clear, well-lit photos from multiple angles</li>
            <li>• Include close-ups of any damage or defects</li>
            <li>• JPEG, PNG, or WebP format • Maximum 5MB per image</li>
            <li>• First image will be used as the cover photo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step1UploadImages;
