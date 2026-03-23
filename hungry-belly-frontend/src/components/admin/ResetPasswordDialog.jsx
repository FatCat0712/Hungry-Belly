import React, { useState } from "react";
import { toast } from "react-toastify";
import { useResetPassword } from "../../hooks/users/useResetPassword";

function ResetPasswordDialog({ open, user, onClose }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useResetPassword();

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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
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
          setFormData({ newPassword: "", confirmPassword: "" });
          onClose();
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

  const handleClose = () => {
    setFormData({ newPassword: "", confirmPassword: "" });
    setErrors({});
    onClose();
  };

  if (!open || !user) return null;

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
              Reset Password - {user.firstName} {user.lastName}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
              disabled={isLoading}
            ></button>
          </div>
          <div className="modal-body">
            <p className="text-muted mb-4">
              Enter a new password for this user account. They will need to use
              this password on their next login.
            </p>

            <form onSubmit={handleSubmit}>
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

              <div className="modal-footer border-top mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
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
  );
}

export default ResetPasswordDialog;
