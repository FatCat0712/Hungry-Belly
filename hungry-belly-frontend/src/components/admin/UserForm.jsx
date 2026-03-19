import React, { useState } from "react";
import assets from "../../assets/assets";

const roles = ["Admin", "User", "Staff", "Support", "Shipper"];

function UserForm({ initialData, onSubmit, onClose }) {
  const [image, setImage] = useState(false);
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    password: "",
    roles: initialData?.roles || [],
    photo: initialData?.photo || null,
    useDefaultPhoto: initialData?.useDefaultPhoto || false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
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
            <h5 className="modal-title">Add New User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
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
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
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
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

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
                            checked={formData.roles.includes(role)}
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
              </div>

              <div className="mb-3 d-flex">
                <div className="form-label me-5">Enabled: </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="enabled"
                    checked={formData.enabled}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                  />
                </div>
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
                      disabled={formData.useDefaultPhoto}
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
              onClick={onSubmit}
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
