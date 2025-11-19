import axiosInstance from "../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import useAuthStore from "../store/authStore";

// API Calls
export const authAPI = {
  signup: async (userData) => {
    const { data } = await axiosInstance.post("/users/signup", userData);
    return data;
  },

  login: async (credentials) => {
    const { data } = await axiosInstance.post("/users/login", credentials);
    return data;
  },

  verifyOTP: async (otpData) => {
    const { data } = await axiosInstance.post("/users/verify-otp", otpData);
    return data;
  },

  logout: async () => {
    const { data } = await axiosInstance.post("/users/logout");
    return data;
  },

  getProfile: async (userId) => {
    const { data } = await axiosInstance.get(`/users/${userId}`);
    return data;
  },

  updateProfile: async ({ userId, userData }) => {
    const { data } = await axiosInstance.put(
      `/users/profile/${userId}`,
      userData
    );
    return data;
  },
  updateUserAddress: async ({ userId, addressData }) => {
    const { data } = await axiosInstance.put(
      `/users/address/${userId}`,
      addressData
    );
    return data;
  },
};

// React Query Hooks
export const useSignup = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authAPI.signup,
    onSuccess: (data) => {
      // Note: Backend returns user info but we need to login separately
      // as signup doesn't return token
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // Login returns OTP requirement, not immediate auth
      // Actual auth happens in verifyOTP
    },
  });
};

export const useVerifyOTP = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authAPI.verifyOTP,
    onSuccess: (data) => {
      // Backend sets httpOnly cookie, but we'll also store in localStorage for client-side checks
      setAuth(data.user, data.token || "cookie-based");
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};

export const useProfile = (userId) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => authAPI.getProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });
    },
  });
};

export const useUpdateUserAddress = () => {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: authAPI.updateUserAddress,
    onSuccess: (data, variables) => {
      // Update the user in the store with new addresses
      if (data.addresses) {
        updateUser({ addresses: data.addresses });
      }
      // Also invalidate queries to refetch user data
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });
    },
  });
};
