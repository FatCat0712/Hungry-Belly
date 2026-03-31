import React from "react";
import UserForm from "../../components/admin/UserForm";

const CreaterUser = () => {
  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Users</small>
        <h1 className="h3 mb-1 text-center">Add New User</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <UserForm selectedUser={null} />
        </div>
      </div>
    </div>
  );
};

export default CreaterUser;
