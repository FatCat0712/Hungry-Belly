import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import assets from "../../../shared/assets/assets";
import { AuthContext } from "../../auth/context/auth-context";
import {
  useGetAccountPresignedUrl,
  useUpdateAccount,
} from "../../auth/hooks/useAuth";

import { useUploadPhoto } from "../../../shared/hooks/useStorage";

const UserAccountUpdate = () => {
  const { user: loggedInUser } = useContext(AuthContext);

  const [user, setUser] = useState(loggedInUser || {});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { updateAccount } = useUpdateAccount();
  const { getPresignedUrl } = useGetAccountPresignedUrl();
  const { uploadPhoto } = useUploadPhoto();

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

      setUser((prev) => ({ ...prev, photo: file }));

      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (user.password && e.target.value !== user.password) {
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

    try {
      if (user.photo !== null && user.photo instanceof File) {
        const transferData = { ...user, photo: user.photo.name };
        result = await updateAccount(transferData);
      } else {
        const transferData = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          roles: user.roles,
          enabled: user.enabled,
        };
        result = await updateAccount(transferData);
      }

      if (user.photo !== null && user.photo instanceof File) {
        const { id } = result;
        const presignedResult = await getPresignedUrl({
          userId: id,
          fileName: user.photo.name,
          contentType: user.photo.type,
        });

        await uploadPhoto({
          uploadUrl: presignedResult.uploadUrl,
          file: user.photo,
          contentType: user.photo.type,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({ queryKey: ["users", user?.id] });

      toast.success("Profile updated successfully");
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
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Users</small>
        <h1 className="h3 mb-1 text-center">Edit Account</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="border-bottom mb-2">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  required
                  style={{ backgroundColor: "#f8f9fa" }}
                  value={user.email || ""}
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
                    value={user.firstName || ""}
                    onChange={(e) =>
                      setUser((prevUser) => ({
                        ...prevUser,
                        firstName: e.target.value,
                      }))
                    }
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
                    value={user.lastName || ""}
                    onChange={(e) =>
                      setUser((prevUser) => ({
                        ...prevUser,
                        lastName: e.target.value,
                      }))
                    }
                  />
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
                    value={user.password || ""}
                    onChange={(e) =>
                      setUser((prevUser) => ({
                        ...prevUser,
                        password: e.target.value,
                      }))
                    }
                  />
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
                    <strong>{user.roles}</strong>
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
                  {errors.photo && (
                    <p style={{ color: "red" }}>{errors.photo}</p>
                  )}
                  <div className="form-check mt-1">
                    <label className="form-label" htmlFor="useDefault">
                      <img
                        src={
                          user.photo instanceof File
                            ? URL.createObjectURL(user.photo)
                            : user.photo
                              ? user.photo
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
        </div>
      </div>
    </div>
  );
};

export default UserAccountUpdate;
