import { create } from "zustand";
import { persist } from "zustand/middleware";

const useListingStore = create(
  persist(
    (set, get) => ({
      // Current listing being created/edited
      currentListing: null,

      // Form data for multi-step form
      listingFormData: {
        // Step 1 - Images
        images: [],
        imagePreviews: [],
        aiAnalysisResult: null,

        // Step 2 - Product Details
        productCategory: "",
        brand: "",
        model: "",
        manufacture_year: "",
        condition: "",
        description: "",
        accessories: "",
        battery: "",
        video_link: "",

        // Step 3 - Pricing
        price: "",
        price_type: "fixed",
        delivery_options: [],

        // Step 4 - Contact & Address
        name: "",
        email: "",
        phone: "",
        contact_preference: "phone",
        location: "",
        address: "",
      },

      // Current step in form wizard
      currentStep: 1,

      // Actions
      setListingFormData: (data) => {
        set((state) => ({
          listingFormData: { ...state.listingFormData, ...data },
        }));
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      setAIAnalysisResult: (result) => {
        set((state) => ({
          listingFormData: {
            ...state.listingFormData,
            aiAnalysisResult: result,
          },
        }));
      },

      updateListingField: (field, value) => {
        set((state) => ({
          listingFormData: {
            ...state.listingFormData,
            [field]: value,
          },
        }));
      },

      resetListingForm: () => {
        set({
          currentListing: null,
          currentStep: 1,
          listingFormData: {
            images: [],
            imagePreviews: [],
            aiAnalysisResult: null,
            productCategory: "",
            brand: "",
            model: "",
            manufacture_year: "",
            condition: "",
            description: "",
            accessories: "",
            battery: "",
            video_link: "",
            price: "",
            price_type: "fixed",
            delivery_options: [],
            name: "",
            email: "",
            phone: "",
            contact_preference: "phone",
            location: "",
            address: "",
          },
        });
      },

      setCurrentListing: (listing) => {
        set({ currentListing: listing });
      },

      // Prefill form with AI results
      prefillWithAIResults: (aiData) => {
        const suggestedData = aiData.suggested_form_data || {};
        set((state) => ({
          listingFormData: {
            ...state.listingFormData,
            productCategory: suggestedData.product_category || "",
            brand: suggestedData.brand || "",
            model: suggestedData.model || "",
            manufacture_year: suggestedData.manufacture_year || "",
            condition: suggestedData.condition || "",
            description: suggestedData.description || "",
            accessories: suggestedData.accessories || "",
            battery: suggestedData.battery || "",
            price: suggestedData.price || "",
            price_type: suggestedData.price_type || "fixed",
            aiAnalysisResult: aiData,
          },
        }));
      },
    }),
    {
      name: "listing-storage",
      partialize: (state) => ({
        listingFormData: state.listingFormData,
        currentStep: state.currentStep,
      }),
    }
  )
);

export default useListingStore;
