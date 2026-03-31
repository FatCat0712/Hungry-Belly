import React from "react";
import { toast } from "react-toastify";
import { useDeleteRole } from "../../hooks/roles/useDeleteRole";

const DeleteRoleConfirmDialog = ({ open, onClose, role, onSuccess }) => {
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  const handleConfirmDelete = () => {
    deleteRole(role.id, {
      onSuccess: () => {
        toast.success(`Role "${role.name}" deleted successfully`);
        onClose();
        onSuccess?.();
      },
      onError: (error) => {
        const message = error.response?.data?.message || error.message;
        toast.error(message || "Failed to delete role");
      },
    });
  };

  if (!open) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{
          display: "block",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1040,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{
          display: "block",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1050,
          width: "100%",
          height: "100%",
          overflow: "auto",
          overflowY: "auto",
        }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-sm" style={{ margin: "auto" }}>
          <div className="modal-content" style={{ backgroundColor: "#ffffff" }}>
            <div className="modal-header border-bottom bg-danger bg-opacity-10">
              <h5 className="modal-title text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Delete Role
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={isDeleting}
              ></button>
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Are you sure you want to delete the role{" "}
                <strong>"{role.name}"</strong>?
              </p>
              <small className="text-muted d-block mt-2">
                This action cannot be undone. Users with this role may be
                affected.
              </small>
            </div>

            <div className="modal-footer border-top">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger d-flex align-items-center gap-2"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Delete Role
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteRoleConfirmDialog;
