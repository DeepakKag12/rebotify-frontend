import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";

// ==================== Statistics APIs ====================

/**
 * Fetch admin dashboard statistics (user counts)
 */
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await axios.get("/users/stats/admin");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Fetch certificate statistics
 */
export const useCertificateStats = () => {
  return useQuery({
    queryKey: ["certificateStats"],
    queryFn: async () => {
      const response = await axios.get("/certificates/stats/admin");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ==================== User Management APIs ====================

/**
 * Fetch all users with pagination and optional search
 */
export const useAllUsers = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["allUsers", page, limit, search],
    queryFn: async () => {
      const response = await axios.get("/users/all", {
        params: { page, limit, search },
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

/**
 * Delete a user (admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }) => {
      const response = await axios.delete(`/users/${userId}`, {
        data: { reason },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate users list and stats
      queryClient.invalidateQueries(["allUsers"]);
      queryClient.invalidateQueries(["adminStats"]);
    },
  });
};

// ==================== Certificate Management APIs ====================

/**
 * Fetch all certificates with pagination and optional filters
 */
export const useAllCertificates = (page = 1, limit = 10, status = "") => {
  return useQuery({
    queryKey: ["allCertificates", page, limit, status],
    queryFn: async () => {
      const response = await axios.get("/certificates/all", {
        params: { page, limit, status },
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

/**
 * Update certificate status (approve/disapprove)
 */
export const useUpdateCertificateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ certificateId, status }) => {
      const response = await axios.patch(
        `/certificates/status/${certificateId}`,
        {
          status,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate certificates list and stats
      queryClient.invalidateQueries(["allCertificates"]);
      queryClient.invalidateQueries(["certificateStats"]);
    },
  });
};
