import React, { useState } from "react";
import { useSyncedFormState } from "../../../shared/hooks/useSyncedFormState";
import { useNavigate } from "react-router-dom";
import { useUpdateAccount } from "../../auth/hooks/useAuth";
import { useEntityUploader } from "../../../shared/hooks/useEntityUploader";
import { toast } from "react-toastify";
import assets from "../../../shared/assets/assets";

const buildAccountFormData = (user) => ({
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

const AccountForm = ({ loggedInUser }) => {
  const { data, setData, setIsDirty } = useSyncedFormState(
    loggedInUser,
    buildAccountFormData,
  );
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState(data.photoUrl || null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { updateAccount } = useUpdateAccount();
  const { uploadFiles } = useEntityUploader({
    queryKey: "users",
    entityType: "USER",
  });

  const handleInputChange = (e) => {
    setIsDirty(true);
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoChange = async (e) => {
    setIsDirty(true);
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const file = files.find((selectedFile) => selectedFile.size > 2 * 1024 * 1024);
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
    setData((prev) => ({ ...prev, photoPath: uploadedPhoto.path }));
    setCurrentPhoto(uploadedPhoto.publicUrl);

    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(e.target.value);

    if (data.password && value !== data.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result = null;

    if (data.password && confirmPassword !== data.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    try {
      const transferData = {
        ...data,
        photo: data.photoPath,
      };

      result = await updateAccount(transferData);

      toast.success(result.message || "Profile updated successfully");
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

  return (
    <>
      <div className="border-bottom mb-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              required
              style={{ backgroundColor: "#f8f9fa" }}
              value={data.email}
              readOnly
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

          <div className="row mb-3">
            <div className="col-md-12">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="leave blank if you don't want to change password"
                value={data.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            {errors.confirmPassword && (
              <p style={{ color: "red" }}>{errors.confirmPassword}</p>
            )}
          </div>

          <div className="row mb-3x">
            <div className="col-md-">
              <label className="form-label">Assigned Roles: </label>
              <span className="mx-4">
                <strong>
                  {Array.isArray(data.roles)
                    ? data.roles.join(", ")
                    : data.roles}
                </strong>
              </span>
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
          onClick={() => navigate(-1)}
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
    </>
  );
};

export default AccountForm;
