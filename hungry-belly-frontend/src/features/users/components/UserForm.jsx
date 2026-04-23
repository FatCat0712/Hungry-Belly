import React, { useState } from "react";
import assets from "../../../shared/assets/assets";

import { toast } from "react-toastify";
import { useRoles } from "../../roles/hooks/useRole";

import { useLocation, useNavigate } from "react-router-dom";
import { useCreateUser, useUpdateUser } from "../hooks/useUser";
import { useSyncedFormState } from "../../../shared/hooks/useSyncedFormState";
import { useEntityUploader } from "../../../shared/hooks/useEntityUploader";

const buildUserFormData = (user) => ({
  id: user?.id || null,
  email: user?.email || "",
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  password: user?.password || "",
  roles: user?.roles || [],
  enabled: user?.enabled || false,
  photoUrl: user?.photoUrl || null,
  photoPath: user?.photoPath || null,
});

function UserForm({ selectedUser }) {
  const { data, setData, setIsDirty } = useSyncedFormState(
    selectedUser,
    buildUserFormData,
  );

  const [currentPhoto, setCurrentPhoto] = useState(data.photoUrl || null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { createUser } = useCreateUser();
  const { updateUser } = useUpdateUser();
  const { uploadFiles } = useEntityUploader({
    queryKey: "users",
    entityType: "USER",
  });

  const location = useLocation();

  let { roles } = useRoles();

  roles = roles.map((role) => role.name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result = null;

    const transferData = {
      ...data,
      photo: data.photoPath,
    };

    try {
      if (selectedUser) {
        result = await updateUser(transferData);
      } else {
        result = await createUser(transferData);
      }

      toast.success(result.message);
      navigate(`/users${location.search}`);
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
  };

  const handleInputChange = (e) => {
    setIsDirty(true);
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (role) => {
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
    setErrors((prev) => ({ ...prev, roles: "" }));
  };

  const handlePhotoChange = async (e) => {
    setIsDirty(true);
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const file = files.find((file) => file.size > 2 * 1024 * 1024);
    if (file) {
      setErrors((prev) => ({
        ...prev,
        photo: "File size should be less than 2MB",
      }));
      return;
    }

    const uploads = await uploadFiles(files);

    if (!uploads.length) return;

    const uploadedPhoto = uploads[0];
    setData((prev) => ({ ...prev, photo: uploadedPhoto.path }));
    setCurrentPhoto(uploadedPhoto.publicUrl);
    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  return (
    <div>
      <div className="border-bottom mb-2">
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
                placeholder={
                  selectedUser &&
                  "leave blank if you don't want to change password"
                }
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
                  <div className="col-4" key={role}>
                    <div className="form-check mb-2">
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
            {errors.enabled && <p style={{ color: "red" }}>{errors.enabled}</p>}
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
                />
              </div>
              {errors.photo && <p style={{ color: "red" }}>{errors.photo}</p>}
              <div className="form-check mt-1">
                <label className="form-label" htmlFor="useDefault">
                  <img
                    src={currentPhoto ? currentPhoto : assets.upload}
                    alt=""
                    width={98}
                  />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="modal-footer gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/users")}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default UserForm;
