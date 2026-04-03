import React, { useState } from "react";
import { toast } from "react-toastify";
import PermissionTree from "./PermissionTree";
import { useNavigate } from "react-router-dom";
import { useUpdateRole } from "../../hooks/roles/useRoles";
// import { useCreateRole } from "../../hooks/roles/useCreateRole";
// import { useUpdateRole } from "../../hooks/roles/useUpdateRole";
// import { usePermissions } from "../../hooks/roles/usePermissions";

function RoleForm({ selectedRole }) {
  const [data, setData] = useState({
    id: selectedRole?.id || null,
    name: selectedRole?.name || "",
    description: selectedRole?.description || "",
    currentPermissions: selectedRole?.currentPermissions || [],
    allPermissions: selectedRole?.allPermissions || [],
  });

  const [errors, setErrors] = useState({});
  // const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { updateRole } = useUpdateRole();
  // const { permissions, isLoading: isLoadingPermissions } = usePermissions();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transferData = {
      id: data.id,
      name: data.name,
      description: data.description,
      permissions: data.currentPermissions,
    };

    try {
      const response = await updateRole(transferData);

      if (response.status === 200) {
        toast.success("Role updated successfully");
        navigate("/roles");
      }
    } catch (error) {
      const apiError = error.response?.data;
      const apiMessage = apiError?.message;

      if (apiMessage && typeof apiMessage === "object") {
        setErrors((prev) => ({ ...prev, ...apiMessage }));
        return;
      }

      toast.error(apiMessage || error.message || "An error occurred");
      return;
    }

    // Validate
    // if (!data.name.trim()) {
    //   setErrors({ name: "Role name is required" });
    //   return;
    // }

    // const handler = selectedRole ? updateRole : createRole;
    // const payload = selectedRole
    //   ? { roleId: selectedRole.id, roleData: data }
    //   : data;

    // handler(payload, {
    //   onSuccess: () => {
    //     toast.success(
    //       selectedRole
    //         ? "Role updated successfully"
    //         : "Role created successfully",
    //     );
    //   },
    //   onError: (error) => {
    //     const message = error.response?.data?.message || error.message;
    //     toast.error(message || "Failed to save role");
    //   },
    // });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handlePermissionsChange = (newPermissionIds) => {
    setData((prev) => ({ ...prev, currentPermissions: newPermissionIds }));
  };

  // const isLoading = isLoadingPermissions || isCreating || isUpdating;
  let isLoadingPermissions = false;

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-header border-bottom">
        <h5 className="modal-title">
          {selectedRole ? "Edit Role" : "Create Role"}
        </h5>
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
            // disabled={isLoading}
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
            // disabled={isLoading}
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
          ) : data.allPermissions.length > 0 ? (
            <PermissionTree
              permissions={data.currentPermissions}
              allPermissions={data.allPermissions}
              onPermissionChange={handlePermissionsChange}
            />
          ) : (
            <div className="alert alert-info">No permissions available</div>
          )}
        </div>
      </div>

      <div className="border-top d-flex justify-content-end gap-3 p-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleClose}
          // disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary d-flex align-items-center gap-2"
          // disabled={isLoading}
        >
          {/* {isLoading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          )} */}
          {selectedRole ? "Update Role" : "Create Role"}
        </button>
      </div>
    </form>
  );
}

export default RoleForm;
