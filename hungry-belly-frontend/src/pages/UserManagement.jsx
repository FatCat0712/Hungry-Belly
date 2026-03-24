import { useState } from "react";

import Spinner from "../components/Spinner";
import UserDialog from "../components/admin/UserDialog";
import ResetPasswordDialog from "../components/admin/ResetPasswordDialog";
import DeleteUserConfirmDialog from "../components/admin/DeleteUserConfirmDialog";
import { useUsers } from "../hooks/users/useUsers";
import { useCreateUser } from "../hooks/users/useCreateUsers";
import { useToggleStatus } from "../hooks/users/useToggleStatus";
import { toast } from "react-toastify";

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const { users, isLoading } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const { isCreating } = useCreateUser();
  const { toggleStatus } = useToggleStatus();

  const toggleUserStatus = (userId, name, status) => {
    toggleStatus(
      { userId },
      {
        onSuccess: () => {
          const message = status
            ? `${name} has been disabled`
            : `${name} has been enabled`;

          toast.success(message);
        },
      },
    );
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleResetPassword = (user) => {
    setUserToResetPassword(user);
    setShowResetPasswordModal(true);
  };

  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
    setUserToResetPassword(null);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    // Keep modal UX in place until delete API/hook is added.
    handleCloseDeleteConfirmModal();
  };

  if (isLoading || isCreating) {
    return <Spinner message="Loading users..." />;
  }

  return (
    <>
      <div className="container-fluid px-0">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <small className="text-uppercase text-secondary">Admin</small>
            <h1 className="h3 mb-1">User Management</h1>
            <p className="text-muted mb-0">
              Manage platform users, roles, and account status.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i className="bi bi-filter"></i> Filters
            </button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => {
                setShowModal(true);
                setSelectedUser(null);
              }}
            >
              <i className="bi bi-plus-lg"></i> Add User
            </button>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Total Users</small>
                    <h5 className="mb-0">{users.length}</h5>
                  </div>
                  <i className="bi bi-people-fill fs-4 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Active Users</small>
                    <h5 className="mb-0">
                      {users.filter((user) => user.enabled).length}
                    </h5>
                  </div>
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Pending Approvals</small>
                    <h5 className="mb-0">1</h5>
                  </div>
                  <i className="bi bi-clock-fill fs-4 text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="card-title mb-0">All Users</h5>
                <small className="text-muted">Sorted by newest first</small>
              </div>
              <div className="input-group" style={{ maxWidth: 280 }}>
                <span className="input-group-text" id="search-addon">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  aria-label="Search users"
                  aria-describedby="search-addon"
                />
              </div>
            </div>

            <div
              className="table-responsive position-relative"
              style={{ minHeight: isLoading ? 280 : undefined }}
            >
              {isLoading && <Spinner message="Loading users..." />}
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40 }}
                          >
                            {user.photo || user.firstName.charAt(0)}
                          </div>
                          <div>{user.firstName + " " + user.lastName}</div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.roles.map((role) => (
                          <span key={role} className="badge bg-primary me-1">
                            {role}
                          </span>
                        ))}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 ${
                            user.enabled
                              ? "btn-success"
                              : "btn-outline-secondary"
                          }`}
                          role="switch"
                          aria-checked={user.enabled}
                          onClick={() =>
                            toggleUserStatus(
                              user.id,
                              user.firstName + " " + user.lastName,
                              user.enabled,
                            )
                          }
                        >
                          <i
                            className={`bi ${
                              user.enabled ? "bi-toggle-on" : "bi-toggle-off"
                            }`}
                          ></i>
                          {user.enabled ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => {
                            setShowModal(true);
                            setSelectedUser(user);
                          }}
                          title="Edit user info"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning me-1"
                          onClick={() => handleResetPassword(user)}
                          title="Reset password"
                        >
                          <i className="bi bi-key"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClick(user)}
                          title="Delete user"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <UserDialog
        open={showModal}
        onClose={handleCancel}
        selectedUser={selectedUser}
      />

      {/* Reset Password Modal */}
      <ResetPasswordDialog
        open={showResetPasswordModal}
        user={userToResetPassword}
        onClose={handleCloseResetPasswordModal}
      />

      <DeleteUserConfirmDialog
        open={showDeleteConfirmModal}
        user={userToDelete}
        onClose={handleCloseDeleteConfirmModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
