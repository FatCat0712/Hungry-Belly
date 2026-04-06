import React from "react";
import RoleForm from "../../components/admin/RoleForm";

const CreateRole = () => {
  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Roles</small>
        <h1 className="h3 mb-1 text-center">Create Role</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <RoleForm selectedRole={null} />
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
