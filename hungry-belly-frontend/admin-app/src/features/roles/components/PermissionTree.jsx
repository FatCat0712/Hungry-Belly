import React, { useEffect, useMemo, useRef, useState } from "react";

const PermissionTree = ({
  permissions,
  allPermissions,
  onPermissionChange,
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  const groupCheckboxRefs = useRef({});

  // Group permissions by resource (e.g., "users", "roles", "orders")
  const groupedPermissions = useMemo(
    () =>
      allPermissions.reduce((groups, permission) => {
        const resource = permission.resource || "other";
        if (!groups[resource]) {
          groups[resource] = [];
        }
        groups[resource].push(permission);
        return groups;
      }, {}),
    [allPermissions],
  );

  useEffect(() => {
    Object.entries(groupedPermissions).forEach(([resource, perms]) => {
      const checkbox = groupCheckboxRefs.current[resource];
      if (!checkbox) return;

      const resourcePerms = perms.map((p) => p.id);
      const allSelected = resourcePerms.every((id) => permissions.includes(id));
      const someSelected = resourcePerms.some((id) => permissions.includes(id));

      checkbox.indeterminate = someSelected && !allSelected;
    });
  }, [groupedPermissions, permissions]);

  const toggleGroup = (resource) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [resource]: !prev[resource],
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    const newPermissionIds = permissions.includes(permissionId)
      ? permissions.filter((id) => id !== permissionId)
      : [...permissions, permissionId];
    onPermissionChange(newPermissionIds);
  };

  const handleSelectAll = (resource) => {
    const resourcePermissions = groupedPermissions[resource].map((p) => p.id);
    const allSelected = resourcePermissions.every((id) =>
      permissions.includes(id),
    );

    let newPermissions = permissions;
    if (allSelected) {
      newPermissions = permissions.filter(
        (id) => !resourcePermissions.includes(id),
      );
    } else {
      newPermissions = [...new Set([...permissions, ...resourcePermissions])];
    }
    onPermissionChange(newPermissions);
  };

  return (
    <div className="permission-tree">
      {Object.entries(groupedPermissions).map(([resource, perms]) => {
        const isExpanded = expandedGroups[resource] !== false;
        const allSelected = perms.every((permission) =>
          permissions.includes(permission.id),
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
                ref={(el) => {
                  groupCheckboxRefs.current[resource] = el;
                }}
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
                      checked={permissions.includes(permission.id)}
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
                          {permission.name}
                        </small>
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
