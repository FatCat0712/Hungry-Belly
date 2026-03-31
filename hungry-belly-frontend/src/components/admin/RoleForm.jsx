import React, { useState } from "react";
import { toast } from "react-toastify";
import PermissionTree from "./PermissionTree";
import { useCreateRole } from "../../hooks/roles/useCreateRole";
import { useUpdateRole } from "../../hooks/roles/useUpdateRole";
import { usePermissions } from "../../hooks/roles/usePermissions";

function RoleForm({ onClose, selectedRole }) {
  const [data, setData] = useState({
    id: selectedRole?.id || null,
    name: selectedRole?.name || "",
    description: selectedRole?.description || "",
    permissions: selectedRole?.permissions || [],
  });

  const [errors, setErrors] = useState({});
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const { permissions, isLoading: isLoadingPermissions } = usePermissions();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!data.name.trim()) {
      setErrors({ name: "Role name is required" });
      return;
    }

    const handler = selectedRole ? updateRole : createRole;
    const payload = selectedRole
      ? { roleId: selectedRole.id, roleData: data }
      : data;

    handler(payload, {
      onSuccess: () => {
        toast.success(
          selectedRole
            ? "Role updated successfully"
            : "Role created successfully",
        );
        onClose();
      },
      onError: (error) => {
        const message = error.response?.data?.message || error.message;
        toast.error(message || "Failed to save role");
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePermissionsChange = (newPermissions) => {
    setData((prev) => ({ ...prev, permissions: newPermissions }));
  };

  const isLoading = isLoadingPermissions || isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-header border-bottom">
        <h5 className="modal-title">
          {selectedRole ? "Edit Role" : "Create Role"}
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          disabled={isLoading}
        ></button>
      </div>

      <div
        className="modal-body"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <div className="mb-3">
          <label htmlFor="roleName" className="form-label">
            Role Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            id="roleName"
            name="name"
            value={data.name}
            onChange={handleInputChange}
            placeholder="e.g., Restaurant Manager"
            disabled={isLoading}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="roleDescription" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="roleDescription"
            name="description"
            value={data.description}
            onChange={handleInputChange}
            placeholder="Brief description of this role's purpose"
            rows="3"
            disabled={isLoading}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label d-block mb-3">
            <strong>Permissions</strong>
            <small className="text-muted d-block">
              Select the permissions this role should have
            </small>
          </label>

          {isLoadingPermissions ? (
            <div className="text-center py-4">
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading permissions...</span>
              </div>
            </div>
          ) : permissions.length > 0 ? (
            <PermissionTree
              permissions={permissions}
              selectedPermissions={data.permissions}
              onPermissionChange={handlePermissionsChange}
            />
          ) : (
            <div className="alert alert-info">No permissions available</div>
          )}
        </div>
      </div>

      <div className="modal-footer border-top">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary d-flex align-items-center gap-2"
          disabled={isLoading}
        >
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {selectedRole ? "Update Role" : "Create Role"}
        </button>
      </div>
    </form>
  );
}

export default RoleForm;
