import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

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

  // Update delivery status (for delivery partners)
  updateDeliveryStatus: async ({ deliveryId, status }) => {
    const { data } = await axiosInstance.patch(`/deliveries/${deliveryId}`, {
      status,
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

export default deliveryAPI;
