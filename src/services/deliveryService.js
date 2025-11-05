import axiosInstance from "../lib/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";

// Delivery API calls
const deliveryAPI = {
  // Get all deliveries (for delivery partners)
  getAllDeliveries: async () => {
    const { data } = await axiosInstance.get("/deliveries/all");
    return data;
  },

  // Get user's deliveries (as buyer or seller)
  getUserDeliveries: async () => {
    const { data } = await axiosInstance.get("/deliveries/user");
    return data;
  },

  // Get single delivery by ID
  getDeliveryById: async (deliveryId) => {
    const { data } = await axiosInstance.get(`/deliveries/${deliveryId}`);
    return data;
  },

  // Update delivery status (for delivery partners)
  updateDeliveryStatus: async ({ deliveryId, status, notes }) => {
    const { data } = await axiosInstance.patch(`/deliveries/${deliveryId}`, {
      status,
      notes,
    });
    return data;
  },
};

// React Query Hooks
export const useGetUserDeliveries = () => {
  return useQuery({
    queryKey: ["deliveries"],
    queryFn: deliveryAPI.getUserDeliveries,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetAllDeliveries = () => {
  return useQuery({
    queryKey: ["deliveries", "all"],
    queryFn: deliveryAPI.getAllDeliveries,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useGetDeliveryById = (deliveryId) => {
  return useQuery({
    queryKey: ["delivery", deliveryId],
    queryFn: () => deliveryAPI.getDeliveryById(deliveryId),
    enabled: !!deliveryId,
  });
};

export const useUpdateDeliveryStatus = () => {
  return useMutation({
    mutationFn: deliveryAPI.updateDeliveryStatus,
    onSuccess: () => {
      // Invalidate all delivery-related queries
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["delivery"] });
    },
  });
};

export default deliveryAPI;
