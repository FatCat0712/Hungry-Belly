import React, { useState } from "react";
import assets from "../../assets/assets";

import { useCreateUser } from "../../hooks/users/useCreateUsers";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { useRoles } from "../../hooks/roles/useRoles";
import { useUpdateUser } from "../../hooks/users/useUpdateUser";

function UserForm({ onClose, selectedUser }) {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    id: selectedUser?.id || null,
    email: selectedUser?.email || "",
    firstName: selectedUser?.firstName || "",
    lastName: selectedUser?.lastName || "",
    password: "",
    roles: selectedUser?.roles || [],
    enabled: selectedUser?.enabled || false,
    photo: selectedUser?.photo || null,
  });

  const [errors, setErrors] = useState({});
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const { roles } = useRoles();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mutation = selectedUser.id ? updateUserMutation : createUserMutation;

    mutation.mutate(data, {
      onSuccess: (res) => {
        const message = res.message;
        toast.success(message);
        onClose();
      },
      onError: (error) => {
        const res = error.response?.data;
        if (res?.message) {
          setErrors(res.message);
        }
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setData((prev) => ({ ...prev, photo: file }));
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <h5 className="modal-title">
              {selectedUser ? "Edit User" : "Add New User"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={data.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.firstName && (
                    <p style={{ color: "red" }}>{errors.firstName}</p>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={data.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.lastName && (
                    <p style={{ color: "red" }}>{errors.lastName}</p>
                  )}
                </div>
              </div>

              {!selectedUser && (
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                    placeholder="leave blank if you don't want to change password"
                    required
                  />
                  {errors.password && (
                    <p style={{ color: "red" }}>{errors.password}</p>
                  )}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">
                  Roles <span className="text-danger">*</span>
                </label>

                <div
                  className="border rounded p-3"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <div className="row">
                    {roles.map((role) => (
                      <div className="col-4">
                        <div className="form-check mb-2" key={role}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={role}
                            checked={data.roles.includes(role)}
                            onChange={() => handleRoleChange(role)}
                          />
                          <label className="form-check-label" htmlFor={role}>
                            {role}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {errors.roles && <p style={{ color: "red" }}>{errors.roles}</p>}
              </div>

              <div className="mb-3 d-flex">
                <div className="form-label me-5">Enabled: </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="enabled"
                    checked={data.enabled}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                  />
                </div>
                {errors.enabled && (
                  <p style={{ color: "red" }}>{errors.enabled}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Photo</label>
                <div className="d-flex gap-3">
                  <div className="flex-grow-1">
                    <input
                      type="file"
                      className="form-control"
                      id="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={data.useDefaultPhoto}
                    />
                  </div>
                  <div className="form-check mt-1">
                    <label className="form-label" htmlFor="useDefault">
                      <img
                        src={image ? URL.createObjectURL(image) : assets.upload}
                        alt=""
                        width={98}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer border-top">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {selectedUser ? "Save" : "Add User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
