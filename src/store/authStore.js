import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      otpSession: null, // { userId, email, expiresAt, loginCredentials }

      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token, isAuthenticated: true, otpSession: null });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          otpSession: null,
        });
      },

      updateUser: (userData) => {
        set((state) => ({ user: { ...state.user, ...userData } }));
      },

      updateUserAddress: (addressData) => {
        set((state) => ({
          user: { ...state.user, addresses: addressData },
        }));
      },

      setOTPSession: (otpData) => {
        set({ otpSession: otpData });
      },

      clearOTPSession: () => {
        set({ otpSession: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        otpSession: state.otpSession, // Persist OTP session
      }),
    }
  )
);

export default useAuthStore;
