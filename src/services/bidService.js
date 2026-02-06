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

  // Buyer accepts deal (NEW - Payment Workflow)
  buyerAcceptDeal: async (listingId) => {
    const { data } = await axiosInstance.post(`/bids/${listingId}/buyer-accept`);
    return data;
  },

  // Get bid status (NEW - Payment Workflow)
  getBidStatus: async (listingId) => {
    const { data } = await axiosInstance.get(`/bids/${listingId}/status`);
    return data;
  },

  // Create Stripe Checkout Session (NEW - Stripe Redirect Payment)
  createStripeCheckoutSession: async (listingId) => {
    const { data } = await axiosInstance.post(`/bids/${listingId}/stripe/create-checkout-session`);
    return data;
  },

  // Verify Stripe Checkout Session (NEW - Stripe Redirect Payment)
  verifyStripeCheckout: async (listingId, sessionId) => {
    const { data } = await axiosInstance.post(`/bids/${listingId}/stripe/verify-checkout`, {
      session_id: sessionId,
    });
    return data;
  },

  // Create Stripe Payment Intent (NEW - Stripe Payment)
  createStripePaymentIntent: async (listingId) => {
    const { data } = await axiosInstance.post(`/bids/${listingId}/stripe/create-payment-intent`);
    return data;
  },

  // Verify Stripe Payment (NEW - Stripe Payment)
  verifyStripePayment: async (listingId, paymentIntentId) => {
    const { data } = await axiosInstance.post(`/bids/${listingId}/stripe/verify-payment`, {
      payment_intent_id: paymentIntentId,
    });
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
      // Note: Don't invalidate transactions/deliveries here - they don't exist until payment
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

// Buyer accept deal (NEW - Payment Workflow)
export const useBuyerAcceptDeal = () => {
  return useMutation({
    mutationFn: bidAPI.buyerAcceptDeal,
    onSuccess: (data, listingId) => {
      queryClient.invalidateQueries({ queryKey: ["bids", "listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["bids", "status", listingId] });
      queryClient.invalidateQueries({ queryKey: ["bids", "user-history"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

// Get bid status (NEW - Payment Workflow)
export const useGetBidStatus = (listingId) => {
  return useQuery({
    queryKey: ["bids", "status", listingId],
    queryFn: () => bidAPI.getBidStatus(listingId),
    enabled: !!listingId,
    staleTime: 10000, // 10 seconds
  });
};

// Create Stripe Payment Intent (NEW - Stripe Payment)
export const useCreateStripePaymentIntent = () => {
  return useMutation({
    mutationFn: bidAPI.createStripePaymentIntent,
  });
};

// Verify Stripe Payment (NEW - Stripe Payment)
export const useVerifyStripePayment = () => {
  return useMutation({
    mutationFn: ({ listingId, paymentIntentId }) => 
      bidAPI.verifyStripePayment(listingId, paymentIntentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bids", "listing", variables.listingId] });
      queryClient.invalidateQueries({ queryKey: ["bids", "status", variables.listingId] });
      queryClient.invalidateQueries({ queryKey: ["bids", "user-history"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};
