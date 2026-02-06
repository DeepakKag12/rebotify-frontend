import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // Use env variable base URL, strip /api suffix for image paths
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api";
  const baseURL = apiBase.replace(/\/api$/, "");
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${baseURL}/${cleanPath}`;
};

export default axiosInstance;
