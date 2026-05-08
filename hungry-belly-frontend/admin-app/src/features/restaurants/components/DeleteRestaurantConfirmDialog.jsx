import React from "react";
import { useDeleteRestaurant } from "../hooks/useRestaurant";
import { toast } from "react-toastify";

const DeleteRestaurantConfirmDialog = ({ onClose, open, restaurant }) => {
  const { deleteRestaurant } = useDeleteRestaurant();

  if (!open || !restaurant) return null;

  const handleConfirmDelete = async (id) => {
    try {
      const response = await deleteRestaurant(id);
      if (response.status === 204) {
        const message =
          response.data?.message || "Category deleted successfully";
        toast.success(message);
        onClose();
      }
      onClose();
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
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <h5 className="modal-title">Delete Restaurant</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Are you sure you want to delete <strong>{restaurant.name}</strong>
              ? This action cannot be undone.
            </p>
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
              className="btn btn-danger"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRestaurantConfirmDialog;
