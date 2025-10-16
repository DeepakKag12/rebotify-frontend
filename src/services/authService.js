import axiosInstance from '../lib/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import useAuthStore from '../store/authStore';

// API Calls
export const authAPI = {
  signup: async (userData) => {
    const { data } = await axiosInstance.post('/users/signup', userData);
    return data;
  },

  login: async (credentials) => {
    const { data } = await axiosInstance.post('/users/login', credentials);
    return data;
  },

  logout: async () => {
    const { data } = await axiosInstance.post('/users/logout');
    return data;
  },

  getProfile: async (userId) => {
    const { data } = await axiosInstance.get(`/users/${userId}`);
    return data;
  },

  updateProfile: async ({ userId, userData }) => {
    const { data } = await axiosInstance.put(`/users/profile/${userId}`, userData);
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
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // Backend sets httpOnly cookie, but we'll also store in localStorage for client-side checks
      setAuth(data.user, data.token || 'cookie-based');
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
    queryKey: ['profile', userId],
    queryFn: () => authAPI.getProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    },
  });
};
