import { useState } from "react";
import { toast } from "react-toastify";
import { useAddMember } from "../hooks/useRestaurant";

const ROLES = ["OWNER", "MANAGER", "STAFF"];

export default function AddMemberModal({ isOpen, restaurantId, onClose }) {
  const [form, setForm] = useState({ email: "", role: "STAFF" });
  const [error, setError] = useState(null);
  const { addMember } = useAddMember();

  const handleClose = () => {
    setForm({ email: "", role: "STAFF" });
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      const response = await addMember({
        restaurantId,
        email: form.email,
        role: form.role,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response?.message);
      }

      handleClose();
    } catch (err) {
      const apiError = err.response?.data;
      if (err.status === 400 || err.status === 403 || err.status === 404) {
        setError(apiError?.message || "Unable to add member.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <h5 className="modal-title">Add Member</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>

          {error && (
            <div className="alert alert-danger mx-3 mt-3 mb-0">{error}</div>
          )}

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="add-member-email" className="form-label">
                  Email Address
                </label>
                <input
                  id="add-member-email"
                  type="email"
                  className="form-control"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-0">
                <label htmlFor="add-member-role" className="form-label">
                  Role
                </label>
                <select
                  id="add-member-role"
                  className="form-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          <div className="modal-footer border-top gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={!form.email.trim()}
            >
              <i className="bi bi-person-plus-fill me-2"></i>
              Add Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
