import React from "react";
import { useParams } from "react-router-dom";
import { useRole } from "../../hooks/roles/useRole";
import Spinner from "../../components/Spinner";
import RoleForm from "../../components/admin/RoleForm";

const EditRole = () => {
  const { id } = useParams();

  const { role, isLoading } = useRole(id);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Roles</small>
        <h1 className="h3 mb-1 text-center">Edit Role</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <RoleForm selectedRole={role} />
        </div>
      </div>
    </div>
  );
};

export default EditRole;
