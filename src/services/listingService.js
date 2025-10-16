import axiosInstance from "../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import useListingStore from "../store/listingStore";

// API Calls
export const listingAPI = {
  analyzeImages: async (formData) => {
    const { data } = await axiosInstance.post(
      "/listings/analyze-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  createListing: async (formData) => {
    const { data } = await axiosInstance.post("/listings/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  getAllListings: async ({ page = 1, limit = 10, status = "open" }) => {
    const { data } = await axiosInstance.get("/listings/all", {
      params: { page, limit, status },
    });
    return data;
  },

  getListingById: async (listingId) => {
    const { data } = await axiosInstance.get(`/listings/${listingId}`);
    return data;
  },

  getSellerListings: async ({ page = 1, limit = 10, status }) => {
    const { data } = await axiosInstance.get("/listings/seller", {
      params: { page, limit, status },
    });
    return data;
  },

  updateListing: async ({ listingId, formData }) => {
    const { data } = await axiosInstance.put(`/listings/${listingId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  updateListingStatus: async ({ listingId, status }) => {
    const { data } = await axiosInstance.patch(
      `/listings/${listingId}/status`,
      { status }
    );
    return data;
  },

  deleteListing: async (listingId) => {
    const { data } = await axiosInstance.delete(`/listings/${listingId}`);
    return data;
  },
};

// React Query Hooks
export const useAnalyzeImages = () => {
  const prefillWithAIResults = useListingStore(
    (state) => state.prefillWithAIResults
  );

  return useMutation({
    mutationFn: listingAPI.analyzeImages,
    onSuccess: (data) => {
      if (data.success && data.data) {
        prefillWithAIResults(data.data);
      }
    },
  });
};

export const useCreateListing = () => {
  const resetListingForm = useListingStore((state) => state.resetListingForm);

  return useMutation({
    mutationFn: listingAPI.createListing,
    onSuccess: (data) => {
      resetListingForm();
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["seller-listings"] });
    },
  });
};

export const useGetListings = (page = 1, limit = 10, status = "open") => {
  return useQuery({
    queryKey: ["listings", page, limit, status],
    queryFn: () => listingAPI.getAllListings({ page, limit, status }),
  });
};

export const useGetListing = (listingId) => {
  return useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => listingAPI.getListingById(listingId),
    enabled: !!listingId,
  });
};

export const useGetSellerListings = (page = 1, limit = 10, status) => {
  return useQuery({
    queryKey: ["seller-listings", page, limit, status],
    queryFn: () => listingAPI.getSellerListings({ page, limit, status }),
  });
};

export const useUpdateListing = () => {
  const resetListingForm = useListingStore((state) => state.resetListingForm);

  return useMutation({
    mutationFn: listingAPI.updateListing,
    onSuccess: (data, variables) => {
      resetListingForm();
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["seller-listings"] });
      queryClient.invalidateQueries({
        queryKey: ["listing", variables.listingId],
      });
    },
  });
};

export const useUpdateListingStatus = () => {
  return useMutation({
    mutationFn: listingAPI.updateListingStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["seller-listings"] });
      queryClient.invalidateQueries({
        queryKey: ["listing", variables.listingId],
      });
    },
  });
};

export const useDeleteListing = () => {
  return useMutation({
    mutationFn: listingAPI.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["seller-listings"] });
    },
  });
};
