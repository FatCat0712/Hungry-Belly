import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AuthContext } from "../../auth/context/auth-context";
import AccessDenied from "../../access/pages/AccessDenied";
import Spinner from "../../../shared/ui/Spinner";
import {
  useChangeMemberRole,
  useRestaurantDetail,
} from "../hooks/useRestaurant";
import { useToggleStatus } from "../../users/hooks/useUser";
import "../../../shared/styles/RestaurantUserManagement.css";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export default function RestaurantUserManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user: loggedInUser } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMemberForRole, setSelectedMemberForRole] = useState(null);
  const [selectedRoleValue, setSelectedRoleValue] = useState("");
  const { changeMemberRole } = useChangeMemberRole();

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
  } = useRestaurantDetail(id);
  const { toggleStatus } = useToggleStatus();

  const isGranted =
    loggedInUser?.roles.includes("ROLE_ADMIN") ||
    loggedInUser?.roles.includes("ROLE_MANAGER");

  if (!isGranted) {
    return <AccessDenied />;
  }

  if (!restaurant && isLoading) {
    return <Spinner message="Loading restaurant members..." />;
  }

  if (!restaurant && isError) {
    return (
      <div className="container-fluid px-0">
        <div className="alert alert-danger border-0 shadow-sm">
          <h1 className="h5 mb-2">Unable to load restaurant members</h1>
          <p className="mb-0">
            {error?.response?.data?.message ||
              "The selected restaurant could not be loaded."}
          </p>
        </div>
      </div>
    );
  }

  const members = Array.isArray(restaurant?.members) ? restaurant.members : [];
  const restaurantName = restaurant?.name || "Restaurant";
  const normalizedKeyword = normalizeText(keyword);

  const filteredMembers = members.filter((member) => {
    const role = normalizeText(member?.role);
    const status = member?.enabled ? "active" : "inactive";
    const searchable = [member?.fullName, member?.email, member?.role]
      .map(normalizeText)
      .join(" ");

    const matchesKeyword =
      !normalizedKeyword || searchable.includes(normalizedKeyword);
    const matchesRole = roleFilter === "all" || role === roleFilter;
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesKeyword && matchesRole && matchesStatus;
  });

  const roles = ["OWNER", "MANAGER", "STAFF"];

  const owner = members.find((member) => member.role === "OWNER");
  const activeCount = members.filter((member) => member.enabled).length;

  const removeMember = (member) => {
    toggleStatus(
      { userId: member.userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
          const message = member.enabled
            ? `${member.fullName} has been disabled.`
            : `${member.fullName} has been enabled.`;
          toast.success(message);
        },
        onError: (toggleError) => {
          toast.error(
            toggleError?.response?.data?.message ||
              "Unable to update member status.",
          );
        },
      },
    );
  };

  const openChangeRoleModal = (member) => {
    setSelectedMemberForRole(member);
    setSelectedRoleValue(member.role || "");
  };

  const closeChangeRoleModal = () => {
    setSelectedMemberForRole(null);
    setSelectedRoleValue("");
  };

  const handleSaveRoleChange = () => {
    // TODO: Implement role change API call when endpoint is provided
    toast.info("Role change endpoint integration pending...");
    chan

    closeChangeRoleModal();
  };

  return (
    <div className="container-fluid px-0 restaurant-member-management-page">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <small className="text-uppercase text-secondary">
                Restaurants
              </small>
              <h1 className="h3 mb-1">Member Management</h1>
              <p className="text-muted mb-0">
                Manage staff access for <strong>{restaurantName}</strong>.
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/restaurants/${id}`)}
              >
                <i className="bi bi-eye me-1"></i>
                Restaurant details
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled
                title="Add member API is not available yet."
              >
                <i className="bi bi-person-plus-fill me-1"></i>
                Add member
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Total members</small>
              <h4 className="mb-0">{members.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Active members</small>
              <h4 className="mb-0 text-success">{activeCount}</h4>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Inactive members</small>
              <h4 className="mb-0 text-secondary">
                {members.length - activeCount}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-2">
              {owner?.imageUrl ? (
                <img
                  src={owner.imageUrl}
                  alt={owner.fullName}
                  className="member-owner-avatar"
                />
              ) : (
                <div className="member-owner-avatar member-owner-avatar--placeholder">
                  <i className="bi bi-person-fill"></i>
                </div>
              )}
              <div>
                <small className="text-muted d-block">Owner</small>
                <strong>{owner?.fullName || "Unassigned"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2 mb-3">
            <h2 className="h5 mb-0">Restaurant members</h2>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              <div className="input-group" style={{ minWidth: 220 }}>
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search name, email, role"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ minWidth: 150 }}
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="all">All roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ minWidth: 130 }}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Member</th>
                  <th className="d-none d-md-table-cell">Role</th>
                  <th className="d-none d-lg-table-cell">Email</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member.membershipId}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {member.imageUrl ? (
                            <img
                              src={member.imageUrl}
                              alt={member.fullName}
                              className="member-avatar"
                            />
                          ) : (
                            <div className="member-avatar member-avatar--placeholder">
                              <i className="bi bi-person-fill"></i>
                            </div>
                          )}
                          <div>
                            <strong className="d-block">
                              {member.fullName}
                            </strong>
                            <small className="text-muted d-md-none">
                              {member.role} • {member.email}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td className="d-none d-md-table-cell">
                        <span className="badge text-bg-light">
                          {member.role}
                        </span>
                      </td>

                      <td className="d-none d-lg-table-cell">{member.email}</td>

                      <td>
                        <span
                          className={`badge ${
                            member.enabled
                              ? "text-bg-success"
                              : "text-bg-secondary"
                          }`}
                        >
                          {member.enabled ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(`/users/${member.userId}/edit`)
                            }
                            title="Edit user"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => openChangeRoleModal(member)}
                            title="Change role"
                          >
                            <i className="bi bi-shield-lock"></i>
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              member.enabled
                                ? "btn-outline-danger"
                                : "btn-outline-success"
                            }`}
                            onClick={() => removeMember(member)}
                            title={
                              member.enabled
                                ? "Disable member"
                                : "Enable member"
                            }
                          >
                            <i
                              className={`bi ${
                                member.enabled
                                  ? "bi-person-x"
                                  : "bi-person-check"
                              }`}
                            ></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No members match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedMemberForRole && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Change Member Role</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeChangeRoleModal}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <p className="text-muted mb-2">
                    Update role for{" "}
                    <strong>{selectedMemberForRole?.fullName}</strong>
                  </p>
                  <div className="alert alert-light border-1 mb-0">
                    <small>
                      <strong>Current role:</strong>{" "}
                      {selectedMemberForRole?.role}
                    </small>
                  </div>
                </div>

                <label htmlFor="role-select" className="form-label">
                  Select New Role
                </label>
                <select
                  id="role-select"
                  className="form-select"
                  value={selectedRoleValue}
                  onChange={(e) => setSelectedRoleValue(e.target.value)}
                >
                  <option value="">-- Choose a role --</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer border-top gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeChangeRoleModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleSaveRoleChange}
                  disabled={
                    !selectedRoleValue ||
                    selectedRoleValue === selectedMemberForRole?.role
                  }
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
