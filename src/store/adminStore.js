import { create } from "zustand";

const useAdminStore = create((set) => ({
  // User Management State
  selectedUsers: [],
  userSearchQuery: "",
  currentUserPage: 1,
  userFilters: {
    userType: "",
  },

  // Certificate Management State
  selectedCertificates: [],
  certificateSearchQuery: "",
  currentCertificatePage: 1,
  certificateFilters: {
    status: "",
  },

  // User Management Actions
  setUserSearchQuery: (query) => set({ userSearchQuery: query }),
  setCurrentUserPage: (page) => set({ currentUserPage: page }),
  setUserFilters: (filters) =>
    set((state) => ({ userFilters: { ...state.userFilters, ...filters } })),
  toggleUserSelection: (userId) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.includes(userId)
        ? state.selectedUsers.filter((id) => id !== userId)
        : [...state.selectedUsers, userId],
    })),
  clearUserSelection: () => set({ selectedUsers: [] }),

  // Certificate Management Actions
  setCertificateSearchQuery: (query) => set({ certificateSearchQuery: query }),
  setCurrentCertificatePage: (page) => set({ currentCertificatePage: page }),
  setCertificateFilters: (filters) =>
    set((state) => ({
      certificateFilters: { ...state.certificateFilters, ...filters },
    })),
  toggleCertificateSelection: (certId) =>
    set((state) => ({
      selectedCertificates: state.selectedCertificates.includes(certId)
        ? state.selectedCertificates.filter((id) => id !== certId)
        : [...state.selectedCertificates, certId],
    })),
  clearCertificateSelection: () => set({ selectedCertificates: [] }),

  // Reset Actions
  resetUserManagement: () =>
    set({
      selectedUsers: [],
      userSearchQuery: "",
      currentUserPage: 1,
      userFilters: { userType: "" },
    }),
  resetCertificateManagement: () =>
    set({
      selectedCertificates: [],
      certificateSearchQuery: "",
      currentCertificatePage: 1,
      certificateFilters: { status: "" },
    }),
}));

export default useAdminStore;
