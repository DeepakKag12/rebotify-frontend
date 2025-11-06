import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAllCertificates,
  useUpdateCertificateStatus,
} from "../../../services/adminService";
import useAdminStore from "../../../store/adminStore";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";

const CertificateManagementPage = () => {
  const {
    currentCertificatePage,
    certificateFilters,
    setCurrentCertificatePage,
    setCertificateFilters,
  } = useAdminStore();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Certificates", path: "/admin/certificates" },
  ];

  const { data, isLoading, error } = useAllCertificates(
    currentCertificatePage,
    10,
    activeTab
  );
  const updateStatusMutation = useUpdateCertificateStatus();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentCertificatePage(1);
    setCertificateFilters({ status: tab });
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setViewModalOpen(true);
  };

  const handleStatusUpdate = async (certificateId, status) => {
    if (!confirm(`Are you sure you want to ${status} this certificate?`)) {
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        certificateId,
        status,
      });
      setViewModalOpen(false);
      setSelectedCertificate(null);
    } catch (error) {
      console.error("Failed to update certificate:", error);
      alert(error.response?.data?.message || "Failed to update certificate");
    }
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar navItems={navItems} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/admin/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Certificate Management
            </h1>
            <p className="text-gray-600 mt-1">
              Review and approve recycler certificates
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange("pending")}
                className={`${
                  activeTab === "pending"
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Pending Review
                {data?.totalCertificates > 0 && activeTab === "pending" && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                    {data.totalCertificates}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleTabChange("approved")}
                className={`${
                  activeTab === "approved"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Approved
                {data?.totalCertificates > 0 && activeTab === "approved" && (
                  <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">
                    {data.totalCertificates}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleTabChange("disapproved")}
                className={`${
                  activeTab === "disapproved"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Disapproved
                {data?.totalCertificates > 0 && activeTab === "disapproved" && (
                  <span className="ml-2 bg-red-100 text-red-800 py-0.5 px-2 rounded-full text-xs">
                    {data.totalCertificates}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Certificates Table */}
        <Card className="bg-white shadow-md">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load certificates</p>
              <p className="text-sm text-gray-500 mt-2">
                {error.response?.data?.message || error.message}
              </p>
            </div>
          ) : data?.certificates?.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="text-gray-500 mt-2">No {activeTab} certificates</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recycler
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certificate Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issuing Authority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Validity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.certificates?.map((cert) => (
                      <tr key={cert._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                              {cert.uploadby?.name?.charAt(0).toUpperCase() ||
                                "R"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {cert.uploadby?.name || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {cert.uploadby?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {cert.documentType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {cert.certificateNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {cert.issuingAuthority}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(cert.validityPeriod)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                              cert.status
                            )}`}
                          >
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {data.currentPage} of {data.totalPages} (
                    {data.totalCertificates} total certificates)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        setCurrentCertificatePage(currentCertificatePage - 1)
                      }
                      disabled={currentCertificatePage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentCertificatePage(currentCertificatePage + 1)
                      }
                      disabled={currentCertificatePage === data.totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* View Certificate Modal */}
      {viewModalOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Certificate Details
                </h3>
                <button
                  onClick={() => setViewModalOpen(false)}
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

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recycler Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.uploadby?.name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.uploadby?.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.documentType}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Number
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.certificateNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuing Authority
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificate.issuingAuthority}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validity Period
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedCertificate.validityPeriod)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        selectedCertificate.status
                      )}`}
                    >
                      {selectedCertificate.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uploaded On
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedCertificate.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Document
                  </label>
                  {selectedCertificate.uploadDocument ? (
                    <a
                      href={`${"http://localhost:3005"}/${
                        selectedCertificate.uploadDocument
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download Certificate
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No document uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedCertificate.status === "pending" && (
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <Button
                    onClick={() =>
                      handleStatusUpdate(selectedCertificate._id, "disapproved")
                    }
                    className="bg-red-600 hover:bg-red-700"
                    disabled={updateStatusMutation.isPending}
                  >
                    Disapprove
                  </Button>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(selectedCertificate._id, "approved")
                    }
                    className="bg-green-600 hover:bg-green-700"
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending
                      ? "Processing..."
                      : "Approve"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateManagementPage;
