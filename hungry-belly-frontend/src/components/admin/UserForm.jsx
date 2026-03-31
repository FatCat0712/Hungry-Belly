import React, { useState } from "react";
import assets from "../../assets/assets";

import { toast } from "react-toastify";
import { useRoles } from "../../hooks/roles/useRoles";

import { useNavigate } from "react-router-dom";
import {
  useCreateUser,
  useGetPresignedUrl,
  useUpdateUser,
  useUploadPhoto,
} from "../../hooks/users/useUser";
import { useQueryClient } from "@tanstack/react-query";

function UserForm({ selectedUser }) {
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
  const navigate = useNavigate();
  const { createUser } = useCreateUser();
  const { updateUser } = useUpdateUser();
  const { uploadPhoto } = useUploadPhoto();
  const { getPresignedUrl } = useGetPresignedUrl();
  const { roles } = useRoles();
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result = null;

    try {
      if (selectedUser) {
        if (data.photo !== null && data.photo instanceof File) {
          const transferData = { ...data, photo: data.photo.name };
          result = await updateUser(transferData);
        } else {
          const start = data.photo.lastIndexOf("/");
          const end = data.photo.indexOf("?");
          const photoFileName = data.photo
            .substring(start + 1, end)
            .replace(/%20/g, " ");

          const transferData = { ...data, photo: photoFileName };
          result = await updateUser(transferData);
        }
      } else {
        if (data.photo !== null && data.photo instanceof File) {
          const transferData = { ...data, photo: data.photo.name };
          result = await createUser(transferData);
        } else {
          result = await createUser(data);
        }
      }

      if (data.photo !== null && data.photo instanceof File) {
        const { id } = result.data;
        const presignedResult = await getPresignedUrl({
          userId: id,
          fileName: data.photo.name,
          contentType: data.photo.type,
        });

        await uploadPhoto({
          uploadUrl: presignedResult.uploadUrl,
          file: data.photo,
          contentType: data.photo.type,
        });

        await queryClient.invalidateQueries({ queryKey: ["users"] });
        await queryClient.invalidateQueries({ queryKey: ["users", id] });
      }
      toast.success(result.message);
      navigate("/users");
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
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = (role) => {
    setData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
    setErrors((prev) => ({ ...prev, roles: "" }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: "File size should be less than 2MB",
        }));
        return;
      }
      setData((prev) => ({ ...prev, photo: file }));
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  return (
    <div className="modal-content">
      <div className="modal-body border-bottom mb-2">
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
                    src={
                      data.photo instanceof File
                        ? URL.createObjectURL(data.photo)
                        : data.photo
                          ? data.photo
                          : assets.upload
                    }
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
