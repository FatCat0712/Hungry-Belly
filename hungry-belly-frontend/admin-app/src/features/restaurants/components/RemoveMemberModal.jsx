import { useState } from "react";
import { toast } from "react-toastify";
import { useRemoveMember } from "../hooks/useRestaurant";

export default function RemoveMemberModal({
  isOpen,
  member,
  onClose,
  restaurantId,
}) {
  const [error, setError] = useState(null);
  const { removeMember } = useRemoveMember();

  const handleConfirmRemoveMember = async () => {
    if (!member) {
      return;
    }

    try {
      const response = await removeMember({
        restaurantId,
        membershipId: member.membershipId,
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

  const handleClose = () => {
    setError(null);
    onClose();
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
            <h5 className="modal-title">Remove Member</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>

          {error && (
            <div className="alert alert-danger mx-3 mt-3 mb-0">{error}</div>
          )}
          <div className="modal-body">
            <p className="mb-2">
              Are you sure you want to remove <strong>{member.fullName}</strong>{" "}
              from this restaurant?
            </p>
            <p className="text-muted mb-0">
              This action will revoke their access to this restaurant.
            </p>
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
              className="btn btn-danger"
              onClick={handleConfirmRemoveMember}
            >
              <i className="bi bi-person-x me-2"></i>
              Remove Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
