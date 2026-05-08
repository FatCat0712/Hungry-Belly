import { useState } from "react";
import { toast } from "react-toastify";
import { useChangeMemberRole } from "../hooks/useRestaurant";

const ROLES = ["OWNER", "MANAGER", "STAFF"];

export default function ChangeRoleModal({
  isOpen,
  member,
  onClose,
  restaurantId,
}) {
  const [selectedRoleValue, setSelectedRoleValue] = useState(
    member?.role || "",
  );
  const [error, setError] = useState(null);
  const { changeMemberRole } = useChangeMemberRole();

  const handleClose = () => {
    setSelectedRoleValue("");
    setError(null);
    onClose();
  };

  const handleSaveRoleChange = async () => {
    try {
      const response = await changeMemberRole({
        restaurantId,
        userId: member.membershipId,
        newRole: selectedRoleValue,
      });

      if (response.status === 200) {
        toast.success(response?.message);
      }

      handleClose();
    } catch (err) {
      if (err.status === 400 || err.status === 403 || err.status === 404) {
        const apiError = err.response?.data;
        const apiMessage = apiError?.message;
        setError(apiMessage);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  if (!isOpen || !member) {
    return null;
  }

  return (
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
              onClick={handleClose}
            ></button>
          </div>

          {error && <div className="alert alert-danger mx-3">{error}</div>}
          <div className="modal-body">
            <div className="mb-3">
              <p className="text-muted mb-2">
                Update role for <strong>{member?.fullName}</strong>
              </p>
              <div className="alert alert-light border-1 mb-0">
                <small>
                  <strong>Current role:</strong> {member?.role}
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
              {ROLES.map((role) => (
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
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleSaveRoleChange}
              disabled={
                !selectedRoleValue || selectedRoleValue === member?.role
              }
            >
              <i className="bi bi-check-circle me-2"></i>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
