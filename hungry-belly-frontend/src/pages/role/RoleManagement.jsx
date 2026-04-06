import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import DeleteRoleConfirmDialog from "../../components/admin/DeleteRoleConfirmDialog";

import { useRoles } from "../../hooks/roles/useRole";

export default function RoleManagement() {
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const navigate = useNavigate();
  const { roles, isLoading } = useRoles();

  const handleEdit = (role) => {
    navigate(`/roles/${role.id}/edit`);
  };

  const handleDelete = (role) => {
    setRoleToDelete(role);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirmModal(false);
    setRoleToDelete(null);
  };

  if (isLoading) {
    return <Spinner message="Loading roles..." />;
  }

  return (
    <>
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-start gap-2 mb-3">
          <div>
            <small className="text-uppercase text-secondary">Admin</small>
            <h1 className="h3 mb-1">Role Management</h1>
            <p className="text-muted mb-0">
              Create and manage roles with customizable permissions.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => {
                navigate("/roles/new");
              }}
            >
              <i className="bi bi-plus-lg"></i> Create Role
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Total Roles</small>
                    <h5 className="mb-0">{roles.length}</h5>
                  </div>
                  <i className="bi bi-shield-check fs-4 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roles List */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">All Roles</h5>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="row g-3 p-3">
              {roles.map((role) => (
                <div key={role.id} className="col-12 col-sm-6 col-lg-4">
                  <div className="card border h-100 position-relative">
                    {role.isSystem && (
                      <div className="position-absolute top-0 end-0">
                        <span className="badge bg-info rounded-0 rounded-bottom-start">
                          System
                        </span>
                      </div>
                    )}

                    <div className="card-body">
                      <h6 className="card-title mb-1">{role.name}</h6>
                      {role.description && (
                        <p className="card-text text-muted small mb-2">
                          {role.description}
                        </p>
                      )}

                      <div className="d-flex gap-1 flex-wrap mb-3">
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-lock me-1"></i>
                          {role.permissions?.length || 0} perms
                        </span>
                        {role.userCount > 0 && (
                          <span className="badge bg-secondary">
                            <i className="bi bi-people me-1"></i>
                            {role.userCount} user
                            {role.userCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {role.permissions && role.permissions.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">
                            Permissions:
                          </small>
                          <div className="d-flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((perm) => (
                              <span
                                key={perm.id}
                                className="badge bg-primary-light text-primary"
                                style={{
                                  backgroundColor: "#e7f3ff",
                                  color: "#0d6efd",
                                  fontSize: 11,
                                }}
                              >
                                {perm.name}
                              </span>
                            ))}
                            {role.permissions.length > 3 && (
                              <span className="badge bg-light text-muted">
                                +{role.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-footer bg-white border-top">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary flex-grow-1"
                          onClick={() => handleEdit(role)}
                          disabled={role.isSystem}
                          title={
                            role.isSystem ? "System roles cannot be edited" : ""
                          }
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(role)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DeleteRoleConfirmDialog
        open={showDeleteConfirmModal}
        onClose={handleCloseDeleteModal}
        role={roleToDelete}
      />
    </>
  );
}
