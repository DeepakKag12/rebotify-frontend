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
import { toast } from "react-toastify";

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
  const [errors, setErrors] = useState({});

  const { data: certificates, isLoading } = useMyCertificates();
  const uploadMutation = useUploadCertificate();
  const deleteMutation = useDeleteCertificate();
  const updateMutation = useUpdateCertificate();

  const navItems = [
    { label: "Dashboard", path: "/recycler/dashboard" },
    { label: "Browse Listings", path: "/recycler/listings" },
    { label: "My Bids", path: "/recycler/bids" },
    { label: "Certificates", path: "/recycler/certificates" },
  ];

  // Validation functions
  const validateDocumentType = (value) => {
    if (!value || value.trim().length === 0) {
      return "Document type is required";
    }
    if (value.trim().length < 3) {
      return "Document type must be at least 3 characters";
    }
    if (value.trim().length > 100) {
      return "Document type must be less than 100 characters";
    }
    // Only allow letters, numbers, spaces, hyphens, and common punctuation
    if (!/^[a-zA-Z0-9\s\-,.'()&]+$/.test(value)) {
      return "Document type can only contain letters, numbers, spaces, hyphens, and basic punctuation";
    }
    // Must contain at least 2 letters (not just symbols/numbers)
    const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 2) {
      return "Document type must contain at least 2 letters";
    }
    // Check if it's mostly symbols or repeated characters
    if (/^[.\-_,;:!@#$%^&*()+=]+$/.test(value.trim())) {
      return "Document type cannot be only symbols";
    }
    return null;
  };

  const validateCertificateNumber = (value) => {
    if (!value || value.trim().length === 0) {
      return "Certificate number is required";
    }
    if (value.trim().length < 3) {
      return "Certificate number must be at least 3 characters";
    }
    if (value.trim().length > 50) {
      return "Certificate number must be less than 50 characters";
    }
    // Allow alphanumeric, hyphens, slashes, and underscores (common in certificate numbers)
    if (!/^[a-zA-Z0-9\-/_]+$/.test(value)) {
      return "Certificate number can only contain letters, numbers, hyphens, slashes, and underscores";
    }
    // Must contain at least one letter or number (not just symbols)
    if (!/[a-zA-Z0-9]/.test(value)) {
      return "Certificate number must contain at least one letter or number";
    }
    // Check if it's only symbols
    if (/^[\-/_]+$/.test(value.trim())) {
      return "Certificate number cannot be only symbols";
    }
    return null;
  };

  const validateIssuingAuthority = (value) => {
    if (!value || value.trim().length === 0) {
      return "Issuing authority is required";
    }
    if (value.trim().length < 3) {
      return "Issuing authority must be at least 3 characters";
    }
    if (value.trim().length > 150) {
      return "Issuing authority must be less than 150 characters";
    }
    // Allow letters, numbers, spaces, and common punctuation for organization names
    if (!/^[a-zA-Z0-9\s\-,.'()&]+$/.test(value)) {
      return "Issuing authority can only contain letters, numbers, spaces, and basic punctuation";
    }
    // Must contain at least 3 letters (not just symbols/numbers)
    const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 3) {
      return "Issuing authority must contain at least 3 letters";
    }
    // Check if it's mostly symbols or repeated characters
    if (/^[.\-_,;:!@#$%^&*()+=]+$/.test(value.trim())) {
      return "Issuing authority cannot be only symbols";
    }
    return null;
  };

  const validateValidityPeriod = (value) => {
    if (!value) {
      return "Validity period is required";
    }
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return "Validity period cannot be in the past";
    }
    return null;
  };

  const validateFile = (file) => {
    if (!file) {
      return "Please upload a document";
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, JPG, and PNG files are allowed";
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation
    let error = null;
    switch (name) {
      case "documentType":
        error = validateDocumentType(value);
        break;
      case "certificateNumber":
        error = validateCertificateNumber(value);
        break;
      case "issuingAuthority":
        error = validateIssuingAuthority(value);
        break;
      case "validityPeriod":
        error = validateValidityPeriod(value);
        break;
    }
    
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, uploadDocument: file }));
    
    // Validate file
    const error = validateFile(file);
    setErrors((prev) => ({ ...prev, uploadDocument: error }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const documentTypeError = validateDocumentType(formData.documentType);
    const certificateNumberError = validateCertificateNumber(formData.certificateNumber);
    const issuingAuthorityError = validateIssuingAuthority(formData.issuingAuthority);
    const validityPeriodError = validateValidityPeriod(formData.validityPeriod);
    const fileError = validateFile(formData.uploadDocument);

    const newErrors = {
      documentType: documentTypeError,
      certificateNumber: certificateNumberError,
      issuingAuthority: issuingAuthorityError,
      validityPeriod: validityPeriodError,
      uploadDocument: fileError,
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== null)) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    const data = new FormData();
    data.append("documentType", formData.documentType.trim());
    data.append("certificateNumber", formData.certificateNumber.trim());
    data.append("issuingAuthority", formData.issuingAuthority.trim());
    data.append("validityPeriod", formData.validityPeriod);
    data.append("uploadDocument", formData.uploadDocument);

    try {
      await uploadMutation.mutateAsync(data);
      toast.success("Certificate uploaded successfully!");
      setUploadModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to upload certificate:", error);
      toast.error(error.response?.data?.message || "Failed to upload certificate");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields except file (which is optional in edit)
    const documentTypeError = validateDocumentType(formData.documentType);
    const certificateNumberError = validateCertificateNumber(formData.certificateNumber);
    const issuingAuthorityError = validateIssuingAuthority(formData.issuingAuthority);
    const validityPeriodError = validateValidityPeriod(formData.validityPeriod);
    const fileError = formData.uploadDocument ? validateFile(formData.uploadDocument) : null;

    const newErrors = {
      documentType: documentTypeError,
      certificateNumber: certificateNumberError,
      issuingAuthority: issuingAuthorityError,
      validityPeriod: validityPeriodError,
      uploadDocument: fileError,
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== null)) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    const data = new FormData();
    data.append("documentType", formData.documentType.trim());
    data.append("certificateNumber", formData.certificateNumber.trim());
    data.append("issuingAuthority", formData.issuingAuthority.trim());
    data.append("validityPeriod", formData.validityPeriod);
    if (formData.uploadDocument) {
      data.append("uploadDocument", formData.uploadDocument);
    }

    try {
      await updateMutation.mutateAsync({
        certificateId: selectedCertificate._id,
        formData: data,
      });
      toast.success("Certificate updated successfully!");
      setEditModalOpen(false);
      setSelectedCertificate(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update certificate:", error);
      toast.error(error.response?.data?.message || "Failed to update certificate");
    }
  };

  const handleDelete = async (certificateId) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(certificateId);
      toast.success("Certificate deleted successfully!");
    } catch (error) {
      console.error("Failed to delete certificate:", error);
      toast.error(error.response?.data?.message || "Failed to delete certificate");
    }
  };

  const handleEditClick = (certificate) => {
    setSelectedCertificate(certificate);
    const validityDate =
      certificate.validityPeriod?.end || certificate.validityPeriod;
    setFormData({
      documentType: certificate.documentType,
      certificateNumber: certificate.certificateNumber,
      issuingAuthority: certificate.issuingAuthority,
      validityPeriod: new Date(validityDate).toISOString().split("T")[0],
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
    setErrors({});
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
      <DashboardNavbar navItems={navItems} />

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
            className="bg-green-600 hover:bg-green-700"
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
        ) : !certificates || certificates?.length === 0 ? (
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
              className="bg-green-600 hover:bg-green-700"
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
                      {formatDate(
                        cert.validityPeriod?.end || cert.validityPeriod
                      )}
                    </p>
                  </div>
                </div>

                {cert.uploadDocument && (
                  <div className="mb-4">
                    <a
                      href={`${"http://localhost:3005"}/${cert.uploadDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
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
                  {errors.documentType && (
                    <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>
                  )}
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
                  {errors.certificateNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.certificateNumber}</p>
                  )}
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
                  {errors.issuingAuthority && (
                    <p className="text-red-500 text-xs mt-1">{errors.issuingAuthority}</p>
                  )}
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
                  {errors.validityPeriod && (
                    <p className="text-red-500 text-xs mt-1">{errors.validityPeriod}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Document <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                    required
                  />
                  {errors.uploadDocument && (
                    <p className="text-red-500 text-xs mt-1">{errors.uploadDocument}</p>
                  )}
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
                    className="bg-green-600 hover:bg-green-700"
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
                  {errors.documentType && (
                    <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>
                  )}
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
                  {errors.certificateNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.certificateNumber}</p>
                  )}
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
                  {errors.issuingAuthority && (
                    <p className="text-red-500 text-xs mt-1">{errors.issuingAuthority}</p>
                  )}
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
                  {errors.validityPeriod && (
                    <p className="text-red-500 text-xs mt-1">{errors.validityPeriod}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Document (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  />
                  {errors.uploadDocument && (
                    <p className="text-red-500 text-xs mt-1">{errors.uploadDocument}</p>
                  )}
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
                    className="bg-green-600 hover:bg-green-700"
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
