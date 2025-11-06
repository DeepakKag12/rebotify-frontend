import { useState } from "react";
import { Link } from "react-router-dom";
import { useAllUsers, useDeleteUser } from "../../../services/adminService";
import useAdminStore from "../../../store/adminStore";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import DashboardNavbar from "../../../shared/components/DashboardNavbar";

const UserManagementPage = () => {
  const {
    userSearchQuery,
    currentUserPage,
    setUserSearchQuery,
    setCurrentUserPage,
  } = useAdminStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Certificates", path: "/admin/certificates" },
  ];

  const { data, isLoading, error } = useAllUsers(
    currentUserPage,
    10,
    userSearchQuery
  );
  const deleteUserMutation = useDeleteUser();

  const handleSearchChange = (e) => {
    setUserSearchQuery(e.target.value);
    setCurrentUserPage(1); // Reset to first page on search
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser || !deleteReason.trim()) {
      alert("Please provide a reason for deletion");
      return;
    }

    try {
      await deleteUserMutation.mutateAsync({
        userId: selectedUser._id,
        reason: deleteReason,
      });
      setDeleteModalOpen(false);
      setSelectedUser(null);
      setDeleteReason("");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
    setDeleteReason("");
  };

  const getUserTypeBadge = (userType) => {
    const badges = {
      user: "bg-green-100 text-green-800",
      recycler: "bg-purple-100 text-purple-800",
      delivery: "bg-orange-100 text-orange-800",
      admin: "bg-blue-100 text-blue-800",
    };
    return badges[userType] || "bg-gray-100 text-gray-800";
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
            <Link
              to="/admin/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all platform users
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6 bg-white shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={userSearchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="bg-white shadow-md">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load users</p>
              <p className="text-sm text-gray-500 mt-2">
                {error.response?.data?.message || error.message}
              </p>
            </div>
          ) : data?.users?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.users?.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || "Unknown"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUserTypeBadge(
                              user.userType
                            )}`}
                          >
                            {user.userType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phone || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteClick(user)}
                            disabled={user.userType === "admin"}
                            className={`text-red-600 hover:text-red-900 ${
                              user.userType === "admin"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Delete
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
                    {data.totalUsers} total users)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentUserPage(currentUserPage - 1)}
                      disabled={currentUserPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentUserPage(currentUserPage + 1)}
                      disabled={currentUserPage === data.totalPages}
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete User
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedUser?.name}</span> (
                {selectedUser?.email})?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for deletion <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Provide a reason for deleting this user..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={handleDeleteCancel}
                  variant="outline"
                  disabled={deleteUserMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={
                    deleteUserMutation.isPending || !deleteReason.trim()
                  }
                >
                  {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
