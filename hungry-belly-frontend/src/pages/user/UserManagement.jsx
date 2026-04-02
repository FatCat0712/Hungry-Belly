import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import DeleteUserConfirmDialog from "../../components/admin/DeleteUserConfirmDialog";
import {
  useExportUsers,
  useListUsersByPage,
  useToggleStatus,
  useUserStats,
} from "../../hooks/users/useUser";
import { toast } from "react-toastify";
import { useDebounce } from "../../hooks/useDebounce";

export default function UserManagement() {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const {
    stats: { activeUsers, totalUsers },
    hasLoadedStats,
    isLoading: isStatsLoading,
  } = useUserStats();

  const { data, isLoading } = useListUsersByPage({
    pageNum: currentPage,
    pageSize,
    sortField,
    sortDirection,
    keyword: debouncedKeyword,
  });
  const [userToDelete, setUserToDelete] = useState(null);

  const users = data?.content || [];
  const totalElements = data?.totalElements || 0;

  const navigate = useNavigate();
  const { toggleStatus } = useToggleStatus();

  const [format, setFormat] = useState("");
  const { exportUsers } = useExportUsers(format);

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

  const handlePageChange = (page) => {
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  const handleExportUsers = async () => {
    // Keep modal UX in place until export API/hook is added.
    toast.info("Exporting users... Please wait.");
    const data = await exportUsers();
    window.open(data.downloadUrl);
  };

  if ((!data && isLoading) || (!hasLoadedStats && isStatsLoading)) {
    return <Spinner message="Loading users..." minHeight="50vh" />;
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
            <button
              className="btn btn-secondary d-flex align-items-center gap-2"
              onClick={() => {
                setFormat("excel");
                handleExportUsers();
              }}
            >
              <i className="bi bi-download"></i> Export Excel
            </button>
            <button
              className="btn btn-info d-flex align-items-center gap-2"
              onClick={() => {
                setFormat("csv");
                handleExportUsers();
              }}
            >
              <i className="bi bi-download"></i> Export CSV
            </button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/users/new")}
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
                    <h5 className="mb-0">{totalUsers}</h5>
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
                    <h5 className="mb-0">{activeUsers}</h5>
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
                <small className="text-muted">
                  Sorted by {sortField === "enabled" ? "status" : sortField} in{" "}
                  {sortDirection}ending order
                </small>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <div className="input-group" style={{ width: 200 }}>
                  <span className="input-group-text">
                    <i className="bi bi-sort-down"></i>
                  </span>
                  <select
                    className="form-select"
                    aria-label="Sort users by"
                    onChange={(e) => setSortField(e.target.value)}
                    value={sortField}
                  >
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                    <option value="email">Email</option>
                    <option value="enabled">Status</option>
                  </select>
                </div>

                <div className="input-group" style={{ width: 200 }}>
                  <span className="input-group-text">
                    <i className="bi bi-sort-down"></i>
                  </span>
                  <select
                    className="form-select"
                    aria-label="Sort users by"
                    onChange={(e) => setSortDirection(e.target.value)}
                    value={sortDirection}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <div className="input-group" style={{ width: 280 }}>
                  <span className="input-group-text" id="search-addon">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search users..."
                    aria-label="Search users"
                    aria-describedby="search-addon"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div
              className="table-responsive position-relative"
              style={{ minHeight: isLoading ? 280 : undefined }}
            >
              {isLoading && <Spinner message="Loading users..." overlay />}
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 40, height: 40 }}
                            >
                              {user.photo ? (
                                <img
                                  src={user.photo}
                                  alt="User"
                                  className="rounded-circle"
                                  style={{ width: 40, height: 40 }}
                                />
                              ) : (
                                user.firstName[0] + user.lastName[0]
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
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
                              navigate(`/users/${user.id}/edit`);
                            }}
                            title="Edit user info"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning me-1"
                            onClick={() =>
                              navigate(`/users/${user.id}/reset-password`)
                            }
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalElements}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <DeleteUserConfirmDialog
        open={showDeleteConfirmModal}
        user={userToDelete}
        onClose={handleCloseDeleteConfirmModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
