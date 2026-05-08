import React from "react";
import { useDeleteCategory } from "../hooks/useCategory";
import { toast } from "react-toastify";

const DeleteCategoryConfirmDialog = ({ onClose, open, category }) => {
  const { deleteCategory } = useDeleteCategory();

  if (!category || !open) return null;

  const handleDeleteCategory = async (id) => {
    try {
      const response = await deleteCategory(id);
      if (response.status === 204) {
        const message =
          response.data?.message || "Category deleted successfully";
        toast.success(message);
        onClose();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete category";
      toast.error(message);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <h5 className="modal-title">Delete Category</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Are you sure you want to delete <strong>"{category.name}"</strong>
              ? This action cannot be undone.
            </p>
            {category.restaurantCount > 0 && (
              <div className="alert alert-warning mt-3 mb-0 py-2">
                <i className="bi bi-exclamation-triangle me-2" />
                This category is used by{" "}
                <strong>{category.restaurantCount}</strong>{" "}
                {category.restaurantCount === 1 ? "restaurant" : "restaurants"}.
              </div>
            )}
          </div>
          <div className="modal-footer border-top">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteCategory(category.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryConfirmDialog;
