import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useGetUser, useResetPassword } from "../../hooks/users/useUser";

function ResetUserPassword() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useGetUser(id);
  const { resetPassword } = useResetPassword();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    resetPassword(
      { userId: user.id, newPassword: formData.newPassword },
      {
        onSuccess: () => {
          toast.success(
            `Password reset successfully for ${user.firstName} ${user.lastName}`,
          );
          setIsLoading(false);
          navigate("/users");
        },
        onError: (error) => {
          const res = error.response?.data;
          if (res?.message) {
            setErrors({ submit: res.message });
          }
          setIsLoading(false);
        },
      },
    );
  };

  if (isUserLoading) {
    return <Spinner message="Loading user..." />;
  }

  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Users</small>
      </div>

      <div className="text-center">
        <h1 className="h3 mb-1">Reset Password</h1>
        <p className="text-muted mb-0">
          Reset password for {user.firstName} {user.lastName}.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <p className="text-muted mb-4">
                  Enter a new password for this user account. They will need to
                  use this password on their next login.
                </p>

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.newPassword ? "is-invalid" : ""
                    }`}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password (min. 8 characters)"
                    disabled={isLoading}
                    required
                  />
                  {errors.newPassword && (
                    <div className="invalid-feedback d-block">
                      {errors.newPassword}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter the password"
                    disabled={isLoading}
                    required
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback d-block">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {errors.submit && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {errors.submit}
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/users")}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetUserPassword;
