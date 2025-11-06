import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";

/**
 * Fetch all certificates for the logged-in recycler
 */
export const useMyCertificates = () => {
  return useQuery({
    queryKey: ["myCertificates"],
    queryFn: async () => {
      const response = await axios.get("/certificates");
      return response.data.certificates; // Return just the certificates array
    },
  });
};

/**
 * Upload a new certificate
 */
export const useUploadCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/certificates/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myCertificates"]);
    },
  });
};

/**
 * Delete a certificate
 */
export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificateId) => {
      const response = await axios.delete(`/certificates/${certificateId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myCertificates"]);
    },
  });
};

/**
 * Update certificate details
 */
export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ certificateId, formData }) => {
      const response = await axios.patch(
        `/certificates/details/${certificateId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myCertificates"]);
    },
  });
};
