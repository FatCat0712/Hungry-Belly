import React from "react";
import { useParams } from "react-router-dom";
import UserForm from "../../components/admin/UserForm";
import { useGetUser } from "../../hooks/users/useUser";
import Spinner from "../../components/Spinner";

const EditUser = () => {
  const { id } = useParams();
  const { user, isLoading } = useGetUser(id);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Users</small>
        <h1 className="h3 mb-1 text-center">Edit User</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <UserForm selectedUser={user} />
        </div>
      </div>
    </div>
  );
};

export default EditUser;
