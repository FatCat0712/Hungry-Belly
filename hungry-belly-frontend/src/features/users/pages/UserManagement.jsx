import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../auth/context/auth-context";
import {
  useExportUsers,
  useListUsersByPage,
  useToggleStatus,
  useUserStats,
} from "../hooks/useUser";
import { toast } from "react-toastify";
import DeleteUserConfirmDialog from "../components/DeleteUserConfirmDialog";
import AccessDenied from "../../access/pages/AccessDenied";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useTableSearchParams } from "../../../shared/hooks/useTableSearchParams";
import Pagination from "../../../shared/ui/Pagination";
import Spinner from "../../../shared/ui/Spinner";

export default function UserManagement() {
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const {
    currentPage,
    sortField,
    sortDirection,
    keyword,
    setPage,
    updateParams,
    pageSize,
  } = useTableSearchParams({
    defaultSortField: "first_name",
  });
  const debouncedKeyword = useDebounce(keyword, 500);
  const normalizedKeyword = debouncedKeyword.trim();

  const {
    stats: { activeUsers, totalUsers },
    hasLoadedStats,
    isLoading: isStatsLoading,
  } = useUserStats();

  const { page, isLoading } = useListUsersByPage({
    pageNum: currentPage,
    pageSize,
    sortField,
    sortDirection,
    keyword: normalizedKeyword || undefined,
  });
  const [userToDelete, setUserToDelete] = useState(null);

  const users = page?.content || [];
  const totalElements = page?.totalElements || 0;

  const navigate = useNavigate();
  const { toggleStatus } = useToggleStatus();

  const [format, setFormat] = useState("");
  const { exportUsers } = useExportUsers(format);

  const { user: loggedInUser } = useContext(AuthContext);

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

  const handlePageChange = (page) => {
    setPage(page, { totalItems: totalElements, pageSize });
  };

  const handleExportUsers = async () => {
    // Keep modal UX in place until export API/hook is added.
    toast.info("Exporting users... Please wait.");
    const data = await exportUsers();
    window.open(data.downloadUrl);
  };

  if ((!page && isLoading) || (!hasLoadedStats && isStatsLoading)) {
    return <Spinner message="Loading users..." minHeight="50vh" />;
  }

  if (loggedInUser?.roles.includes("ROLE_ADMIN") === false) {
    return <AccessDenied />;
  }

  return (
    <>
      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-start gap-2 mb-3">
          <div>
            <small className="text-uppercase text-secondary">Admin</small>
            <h1 className="h3 mb-1">User Management</h1>
            <p className="text-muted mb-0">
              Manage platform users, roles, and account status.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
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

        {/* Statistics Cards */}
        <div className="row g-3 mb-3">
          <div className="col-sm-4">
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
          <div className="col-sm-4">
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
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Inactive Users</small>
                    <h5 className="mb-0">{totalUsers - activeUsers}</h5>
                  </div>
                  <i className="bi bi-person-slash fs-4 text-secondary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center gap-2 mb-3">
              <div>
                <h5 className="card-title mb-0">All Users</h5>
                <small className="text-muted">
                  Sorted by {sortField === "enabled" ? "status" : sortField} in{" "}
                  {sortDirection}ending order
                </small>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <div
                  className="input-group"
                  style={{ minWidth: 150, flex: "1 1 150px" }}
                >
                  <span className="input-group-text">
                    <i className="bi bi-sort-down"></i>
                  </span>
                  <select
                    className="form-select"
                    aria-label="Sort users by"
                    onChange={(e) => {
                      updateParams(
                        { sortField: e.target.value },
                        { resetPage: true },
                      );
                    }}
                    value={sortField}
                  >
                    <option value="first_name">First Name</option>
                    <option value="last_name">Last Name</option>
                    <option value="email">Email</option>
                    <option value="enabled">Status</option>
                  </select>
                </div>

                <div
                  className="input-group"
                  style={{ minWidth: 150, flex: "1 1 150px" }}
                >
                  <span className="input-group-text">
                    <i className="bi bi-sort-down"></i>
                  </span>
                  <select
                    className="form-select"
                    aria-label="Sort users by"
                    onChange={(e) => {
                      updateParams(
                        { sortDirection: e.target.value },
                        { resetPage: true },
                      );
                    }}
                    value={sortDirection}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <div
                  className="input-group"
                  style={{ minWidth: 200, flex: "2 1 200px" }}
                >
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
                    onChange={(e) => {
                      updateParams(
                        { keyword: e.target.value },
                        { resetPage: true },
                      );
                    }}
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
                    <th className="d-none d-lg-table-cell">First Name</th>
                    <th className="d-none d-lg-table-cell">Last Name</th>
                    <th className="d-none d-md-table-cell">Email</th>
                    <th className="d-none d-lg-table-cell">Role</th>
                    <th className="d-none d-md-table-cell">Status</th>
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
                              className="position-relative"
                              style={{ width: 40, height: 40 }}
                            >
                              <div
                                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40 }}
                              >
                                {user.photoUrl ? (
                                  <img
                                    src={user.photoUrl}
                                    alt="User"
                                    className="rounded-circle"
                                    style={{ width: 40, height: 40 }}
                                  />
                                ) : (
                                  user.firstName[0] + user.lastName[0]
                                )}
                              </div>
                              {loggedInUser?.id === user.id && (
                                <span
                                  className="badge bg-info position-absolute"
                                  style={{
                                    top: 0,
                                    left: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 10,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Current user
                                </span>
                              )}
                            </div>
                            <div className="d-flex flex-column">
                              <span
                                className="fw-semibold text-truncate d-md-none"
                                style={{ maxWidth: 140 }}
                              >
                                {user.firstName} {user.lastName}
                              </span>
                              <small
                                className="text-muted d-md-none text-truncate"
                                style={{ maxWidth: 140 }}
                              >
                                {user.email}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {user.firstName}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {user.lastName}
                        </td>
                        <td className="d-none d-md-table-cell">{user.email}</td>
                        <td className="d-none d-lg-table-cell">
                          {user.roles.map((role) => (
                            <span key={role} className="badge bg-primary me-1">
                              {role.replace("ROLE_", "")}
                            </span>
                          ))}
                        </td>
                        <td className="d-none d-md-table-cell">
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

                        <td>
                          <div className="d-flex justify-content-end flex-wrap gap-1">
                            <button
                              type="button"
                              className={`btn btn-sm d-inline-flex d-md-none align-items-center ${
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
                              title={
                                user.enabled ? "Set inactive" : "Set active"
                              }
                            >
                              <i
                                className={`bi ${
                                  user.enabled
                                    ? "bi-check-circle-fill"
                                    : "bi-check-circle"
                                }`}
                              ></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                navigate(`/users/${user.id}/edit`);
                              }}
                              title="Edit user info"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning"
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
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              module="users"
              pageData={page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <DeleteUserConfirmDialog
        open={showDeleteConfirmModal}
        user={userToDelete}
        onClose={handleCloseDeleteConfirmModal}
      />
    </>
  );
}
