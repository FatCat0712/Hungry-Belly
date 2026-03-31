import React, { useState } from "react";

const PermissionTree = ({
  permissions,
  selectedPermissions,
  onPermissionChange,
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  // Group permissions by resource (e.g., "users", "roles", "orders")
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const resource = permission.resource || "other";
    if (!groups[resource]) {
      groups[resource] = [];
    }
    groups[resource].push(permission);
    return groups;
  }, {});

  const toggleGroup = (resource) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [resource]: !prev[resource],
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((id) => id !== permissionId)
      : [...selectedPermissions, permissionId];
    onPermissionChange(newPermissions);
  };

  const handleSelectAll = (resource) => {
    const resourcePermissions = groupedPermissions[resource].map((p) => p.id);
    const allSelected = resourcePermissions.every((id) =>
      selectedPermissions.includes(id),
    );

    let newPermissions = selectedPermissions;
    if (allSelected) {
      newPermissions = selectedPermissions.filter(
        (id) => !resourcePermissions.includes(id),
      );
    } else {
      newPermissions = [
        ...new Set([...selectedPermissions, ...resourcePermissions]),
      ];
    }
    onPermissionChange(newPermissions);
  };

  return (
    <div className="permission-tree">
      {Object.entries(groupedPermissions).map(([resource, perms]) => {
        const isExpanded = expandedGroups[resource] !== false;
        const resourcePerms = perms.map((p) => p.id);
        const allSelected = resourcePerms.every((id) =>
          selectedPermissions.includes(id),
        );
        const someSelected = resourcePerms.some((id) =>
          selectedPermissions.includes(id),
        );

        return (
          <div key={resource} className="permission-group mb-3">
            <div
              className="d-flex align-items-center gap-2 cursor-pointer p-2 rounded"
              style={{
                backgroundColor: "rgba(0,0,0,0.02)",
                cursor: "pointer",
              }}
              onClick={() => toggleGroup(resource)}
            >
              <i
                className={`bi bi-chevron-${isExpanded ? "down" : "right"}`}
              ></i>
              <input
                type="checkbox"
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={() => handleSelectAll(resource)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  accentColor: "#0d6efd",
                  cursor: "pointer",
                }}
              />
              <span className="fw-semibold text-capitalize">{resource}</span>
              <small className="text-muted ms-auto">{perms.length} perms</small>
            </div>

            {isExpanded && (
              <div className="ps-4 pt-2">
                {perms.map((permission) => (
                  <div
                    key={permission.id}
                    className="form-check mb-2 d-flex align-items-center"
                  >
                    <input
                      type="checkbox"
                      id={`perm-${permission.id}`}
                      className="form-check-input"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      style={{
                        accentColor: "#0d6efd",
                        cursor: "pointer",
                      }}
                    />
                    <label
                      htmlFor={`perm-${permission.id}`}
                      className="form-check-label mb-0 ms-2 cursor-pointer flex-grow-1"
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <small className="fw-semibold text-capitalize">
                          {permission.action}
                        </small>
                        {permission.description && (
                          <div className="text-muted" style={{ fontSize: 12 }}>
                            {permission.description}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PermissionTree;
