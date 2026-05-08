import { useState } from "react";
import { useTransferOwnership } from "../hooks/useRestaurant";
import { toast } from "react-toastify";

export default function TransferOwnerModal({
  isOpen,
  onClose,
  currentOwner,
  restaurantId,
}) {
  const [email, setEmail] = useState("");
  const [errorForm, setErrorForm] = useState(null);
  const { transferOwnership, isTransferring } = useTransferOwnership();

  const handleClose = () => {
    setEmail("");

    onClose();
  };

  const handleLocate = (event) => {
    event.preventDefault();
  };

  const handleTransferOwnership = async () => {
    try {
      const response = await transferOwnership({
        restaurantId: restaurantId,
        newOwnerEmail: email.trim(),
      });

      if (response.status === 200) {
        // Optionally show a success message or perform additional actions
        toast.success(response?.message);
      }
      handleClose();
    } catch (error) {
      if (
        error.status === 400 ||
        error.status === 403 ||
        error.status === 404
      ) {
        const apiError = error.response?.data;
        const apiMessage = apiError?.message;
        setErrorForm(apiMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content transfer-owner-modal">
          <div className="modal-header border-bottom">
            <h5 className="modal-title">Transfer Ownership</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="alert alert-warning border-0 transfer-owner-modal__notice">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Ownership is currently assigned to
              <strong className="ms-1">
                {currentOwner?.fullName || "Unknown"}
              </strong>
              .
            </div>

            {errorForm && (
              <div className="alert alert-danger border-0 mb-0">
                {errorForm}
              </div>
            )}

            <form onSubmit={handleLocate}>
              <label
                htmlFor="transfer-owner-email"
                className="form-label fw-semibold"
              >
                Locate new owner by email
              </label>
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  id="transfer-owner-email"
                  type="email"
                  className="form-control"
                  placeholder="member@restaurant.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrorForm(null);
                  }}
                  required
                />
              </div>
            </form>
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
              className="btn transfer-owner-btn"
              disabled={isTransferring}
              title={
                isTransferring
                  ? "Transferring ownership..."
                  : "Transfer ownership"
              }
              onClick={handleTransferOwnership}
            >
              <i className="bi bi-arrow-left-right me-2"></i>
              Transfer ownership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
