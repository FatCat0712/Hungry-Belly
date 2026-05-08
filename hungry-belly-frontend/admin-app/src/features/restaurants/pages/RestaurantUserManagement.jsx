import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../auth/context/auth-context";
import AccessDenied from "../../access/pages/AccessDenied";
import Spinner from "../../../shared/ui/Spinner";
import { useRestaurantDetail } from "../hooks/useRestaurant";
import AddMemberModal from "../components/AddMemberModal";
import ChangeRoleModal from "../components/ChangeRoleModal";
import RemoveMemberModal from "../components/RemoveMemberModal";
import TransferOwnerModal from "../components/TransferOwnerModal";
import "../../../shared/styles/RestaurantUserManagement.css";

export default function RestaurantUserManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: loggedInUser } = useContext(AuthContext);
  const [selectedMemberForRole, setSelectedMemberForRole] = useState(null);
  const [selectedMemberForRemoval, setSelectedMemberForRemoval] =
    useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showTransferOwnerModal, setShowTransferOwnerModal] = useState(false);

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
  } = useRestaurantDetail(id);

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

  const owner = members.find((member) => member.role === "OWNER");
  const activeCount = members.filter((member) => member.enabled).length;

  const openRemoveMemberModal = (member) => {
    setSelectedMemberForRemoval(member);
  };

  const closeRemoveMemberModal = () => {
    setSelectedMemberForRemoval(null);
  };

  const openChangeRoleModal = (member) => {
    setSelectedMemberForRole(member);
  };

  const closeChangeRoleModal = () => {
    setSelectedMemberForRole(null);
  };

  const openAddMemberModal = () => setShowAddMemberModal(true);
  const closeAddMemberModal = () => setShowAddMemberModal(false);
  const openTransferOwnerModal = () => setShowTransferOwnerModal(true);
  const closeTransferOwnerModal = () => setShowTransferOwnerModal(false);

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
                className="btn transfer-owner-btn"
                onClick={openTransferOwnerModal}
                title="Transfer ownership to another member"
              >
                <i className="bi bi-arrow-left-right me-1"></i>
                Transfer owner
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={openAddMemberModal}
                title="Add a new member to this restaurant"
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
                {members.length > 0 ? (
                  members.map((member) => (
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
                            className={"btn btn-sm btn-outline-danger"}
                            onClick={() => openRemoveMemberModal(member)}
                            title="Remove member"
                          >
                            <i className={`bi bi-person-x`}></i>
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

      <RemoveMemberModal
        isOpen={Boolean(selectedMemberForRemoval)}
        member={selectedMemberForRemoval}
        onClose={closeRemoveMemberModal}
        restaurantId={id}
      />

      <ChangeRoleModal
        key={selectedMemberForRole?.membershipId || "change-role-modal"}
        isOpen={Boolean(selectedMemberForRole)}
        member={selectedMemberForRole}
        onClose={closeChangeRoleModal}
        restaurantId={id}
      />

      <AddMemberModal
        isOpen={showAddMemberModal}
        restaurantId={id}
        onClose={closeAddMemberModal}
      />

      <TransferOwnerModal
        isOpen={showTransferOwnerModal}
        onClose={closeTransferOwnerModal}
        currentOwner={owner}
        restaurantId={id}
      />
    </div>
  );
}
