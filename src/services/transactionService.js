import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

// Transaction API calls
const transactionAPI = {
  // Get user's transactions (sales and purchases)
  getUserTransactions: async () => {
    const { data } = await axiosInstance.get("/transactions");
    return data;
  },

  // Get single transaction by ID
  getTransactionById: async (transactionId) => {
    const { data } = await axiosInstance.get(`/transactions/${transactionId}`);
    return data;
  },
};

// React Query Hooks
export const useGetUserTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: transactionAPI.getUserTransactions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetTransactionById = (transactionId) => {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => transactionAPI.getTransactionById(transactionId),
    enabled: !!transactionId,
  });
};

export default transactionAPI;
