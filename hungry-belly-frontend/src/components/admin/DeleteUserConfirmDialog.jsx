import React from "react";
import { useDeleteUser } from "../../hooks/users/useDeleteUser";
import { toast } from "react-toastify";

function DeleteUserConfirmDialog({ open, user, onClose, onConfirm }) {
  const { deleteUser } = useDeleteUser();

  if (!open || !user) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <h5 className="modal-title">Delete User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Are you sure you want to delete{" "}
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              ? This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer border-top">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deleteUser(
                  { userId: user.id },
                  {
                    onSuccess: () => {
                      toast.success(
                        `User ${user.firstName} ${user.lastName} deleted successfully`,
                      );
                      onClose();
                    },
                    onError: (error) => {
                      const res = error.response?.data;
                      toast.error(res?.message || "Failed to delete user");
                    },
                  },
                );
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserConfirmDialog;
