import React from "react";

import { useDeleteRole } from "../../hooks/roles/useRole";
import { toast } from "react-toastify";
// import { useDeleteRole } from "../../hooks/roles/useDeleteRole";

const DeleteRoleConfirmDialog = ({ open, onClose, role }) => {
  const { deleteRole } = useDeleteRole();

  const handleConfirmDelete = () => {
    deleteRole(role.id, {
      onSuccess: () => {
        toast.success(`Role ${role.name} deleted successfully`);
        onClose();
      },
      onError: (error) => {
        const message = error.response?.data?.message || error.message;
        toast.error(message || "Failed to delete role");
      },
    });
  };

  if (!open || !role) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <h5 className="modal-title">Delete Role</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Are you sure you want to delete <strong>Role {role.name}</strong>?
              This action cannot be undone.
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
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleConfirmDialog;
