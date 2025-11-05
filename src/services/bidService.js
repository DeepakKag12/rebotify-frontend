import axiosInstance from "../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";

// API Calls
export const bidAPI = {
  // Get all bids for a specific listing
  getBidsForListing: async (listingId) => {
    const { data } = await axiosInstance.get(`/bids/listing/${listingId}`);
    return data;
  },

  // Get highest bid for a listing
  getHighestBid: async (listingId) => {
    const { data } = await axiosInstance.get(`/bids/highest/${listingId}`);
    return data;
  },

  // Place a bid
  makeBid: async (bidData) => {
    const { data } = await axiosInstance.post("/bids/make", bidData);
    return data;
  },

  // Get user's bid history (recycler's all bids)
  getUserBidHistory: async ({ page = 1, limit = 10 }) => {
    const { data } = await axiosInstance.get("/bids/user/history", {
      params: { page, limit },
    });
    return data;
  },

  // Select buyer (seller action)
  selectBuyer: async (selectionData) => {
    const { data } = await axiosInstance.post(
      "/bids/select-buyer",
      selectionData
    );
    return data;
  },

  // Withdraw bid
  withdrawBid: async (withdrawData) => {
    const { data } = await axiosInstance.post("/bids/withdraw", withdrawData);
    return data;
  },

  // Close auction
  closeAuction: async (closeData) => {
    const { data } = await axiosInstance.post("/bids/close", closeData);
    return data;
  },
};

// React Query Hooks

// Get bids for a listing
export const useGetBidsForListing = (listingId) => {
  return useQuery({
    queryKey: ["bids", "listing", listingId],
    queryFn: () => bidAPI.getBidsForListing(listingId),
    enabled: !!listingId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

// Get highest bid
export const useGetHighestBid = (listingId) => {
  return useQuery({
    queryKey: ["bids", "highest", listingId],
    queryFn: () => bidAPI.getHighestBid(listingId),
    enabled: !!listingId,
    staleTime: 30000,
    refetchInterval: 30000,
  });
};

// Place a bid
export const useMakeBid = () => {
  return useMutation({
    mutationFn: bidAPI.makeBid,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["bids", "listing", variables.listingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["bids", "highest", variables.listingId],
      });
      queryClient.invalidateQueries({ queryKey: ["bids", "user-history"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

// Get user bid history
export const useGetUserBidHistory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["bids", "user-history", page, limit],
    queryFn: () => bidAPI.getUserBidHistory({ page, limit }),
    staleTime: 60000, // 1 minute
  });
};

// Select buyer
export const useSelectBuyer = () => {
  return useMutation({
    mutationFn: bidAPI.selectBuyer,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["seller-listings"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Invalidate transactions to show receipt
      queryClient.invalidateQueries({ queryKey: ["deliveries"] }); // Invalidate deliveries to show new delivery
    },
  });
};

// Withdraw bid
export const useWithdrawBid = () => {
  return useMutation({
    mutationFn: bidAPI.withdrawBid,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      queryClient.invalidateQueries({ queryKey: ["bids", "user-history"] });
    },
  });
};

// Close auction
export const useCloseAuction = () => {
  return useMutation({
    mutationFn: bidAPI.closeAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};
