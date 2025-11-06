import { useState } from "react";
import {
  useMyCertificates,
  useUploadCertificate,
  useDeleteCertificate,
  useUpdateCertificate,
} from "../../../services/certificateService";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";

const MyCertificatesPage = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [formData, setFormData] = useState({
    documentType: "",
    certificateNumber: "",
    issuingAuthority: "",
    validityPeriod: "",
    uploadDocument: null,
  });

  const { data: certificates, isLoading } = useMyCertificates();
  const uploadMutation = useUploadCertificate();
  const deleteMutation = useDeleteCertificate();
  const updateMutation = useUpdateCertificate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, uploadDocument: e.target.files[0] }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.documentType ||
      !formData.certificateNumber ||
      !formData.issuingAuthority ||
      !formData.validityPeriod ||
      !formData.uploadDocument
    ) {
      alert("Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("documentType", formData.documentType);
    data.append("certificateNumber", formData.certificateNumber);
    data.append("issuingAuthority", formData.issuingAuthority);
    data.append("validityPeriod", formData.validityPeriod);
    data.append("uploadDocument", formData.uploadDocument);

    try {
      await uploadMutation.mutateAsync(data);
      setUploadModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to upload certificate:", error);
      alert(error.response?.data?.message || "Failed to upload certificate");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("documentType", formData.documentType);
    data.append("certificateNumber", formData.certificateNumber);
    data.append("issuingAuthority", formData.issuingAuthority);
    data.append("validityPeriod", formData.validityPeriod);
    if (formData.uploadDocument) {
      data.append("uploadDocument", formData.uploadDocument);
    }

    try {
      await updateMutation.mutateAsync({
        certificateId: selectedCertificate._id,
        formData: data,
      });
      setEditModalOpen(false);
      setSelectedCertificate(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update certificate:", error);
      alert(error.response?.data?.message || "Failed to update certificate");
    }
  };

  const handleDelete = async (certificateId) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(certificateId);
    } catch (error) {
      console.error("Failed to delete certificate:", error);
      alert(error.response?.data?.message || "Failed to delete certificate");
    }
  };

  const handleEditClick = (certificate) => {
    setSelectedCertificate(certificate);
    setFormData({
      documentType: certificate.documentType,
      certificateNumber: certificate.certificateNumber,
      issuingAuthority: certificate.issuingAuthority,
      validityPeriod: new Date(certificate.validityPeriod)
        .toISOString()
        .split("T")[0],
      uploadDocument: null,
    });
    setEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      documentType: "",
      certificateNumber: "",
      issuingAuthority: "",
      validityPeriod: "",
      uploadDocument: null,
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      disapproved: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Certificates
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your recycler certificates and credentials
            </p>
          </div>
          <Button
            onClick={() => setUploadModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Certificate
          </Button>
        </div>

        {/* Info Card */}
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-600 mt-0.5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Certificate Verification
              </h3>
              <p className="text-sm text-blue-700">
                Upload your recycling certificates for admin verification.
                Approved certificates will enable you to place bids on listings.
              </p>
            </div>
          </div>
        </Card>

        {/* Certificates Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : certificates?.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No certificates uploaded
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your first certificate to get started
            </p>
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Upload Certificate
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates?.map((cert) => (
              <Card
                key={cert._id}
                className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cert.documentType}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                      cert.status
                    )}`}
                  >
                    {cert.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Certificate Number</p>
                    <p className="text-sm font-medium text-gray-900">
                      {cert.certificateNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Issuing Authority</p>
                    <p className="text-sm font-medium text-gray-900">
                      {cert.issuingAuthority}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valid Until</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(cert.validityPeriod)}
                    </p>
                  </div>
                </div>

                {cert.uploadDocument && (
                  <div className="mb-4">
                    <a
                      href={`${
                        import.meta.env.VITE_API_URL || "http://localhost:5000"
                      }${cert.uploadDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                        />
                      </svg>
                      View Document
                    </a>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleEditClick(cert)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={cert.status === "approved"}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(cert._id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                    disabled={cert.status === "approved"}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Upload Certificate
                </h3>
                <button
                  onClick={() => {
                    setUploadModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    placeholder="e.g., Recycling License"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="certificateNumber"
                    value={formData.certificateNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., REC-2024-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Authority <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="issuingAuthority"
                    value={formData.issuingAuthority}
                    onChange={handleInputChange}
                    placeholder="e.g., Environmental Protection Agency"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validity Period <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    name="validityPeriod"
                    value={formData.validityPeriod}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Document <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setUploadModalOpen(false);
                      resetForm();
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Certificate
                </h3>
                <button
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedCertificate(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="certificateNumber"
                    value={formData.certificateNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Authority <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="issuingAuthority"
                    value={formData.issuingAuthority}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validity Period <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    name="validityPeriod"
                    value={formData.validityPeriod}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Document (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep existing document
                  </p>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setEditModalOpen(false);
                      setSelectedCertificate(null);
                      resetForm();
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificatesPage;
