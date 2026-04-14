import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../../shared/assets/assets";
import { toast } from "react-toastify";
import { useUpdateRestaurant } from "../hooks/useRestaurant";

const RestaurantForm = ({ selectedRestaurant }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    id: selectedRestaurant?.id || null,
    name: selectedRestaurant?.name || "",
    cuisine: selectedRestaurant?.cuisine || "",
    phone: selectedRestaurant?.phone || "",
    address: selectedRestaurant?.address || "",
    description: selectedRestaurant?.description || "",
    photo: selectedRestaurant?.photo || "",
    enabled: selectedRestaurant?.enabled || false,
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { updateRestaurant } = useUpdateRestaurant();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      const response = await updateRestaurant({
        id: selectedRestaurant.id,
        data,
      });
      toast.success(response?.message || "Restaurant updated successfully");
      navigate(`/restaurants/${selectedRestaurant.id}`);
    } catch (error) {
      const apiError = error.response?.data;
      const apiMessage = apiError?.message;

      if (apiMessage && typeof apiMessage === "object") {
        setErrors((prev) => ({ ...prev, ...apiMessage }));
      } else {
        toast.error(
          apiMessage || error.message || "Failed to update restaurant",
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="card border-0 shadow-sm" onSubmit={handleSubmit}>
      <div className="card-body p-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="cuisine">
              Cuisine <span className="text-danger">*</span>
            </label>
            <input
              id="cuisine"
              name="cuisine"
              className={`form-control ${errors.cuisine ? "is-invalid" : ""}`}
              value={data.cuisine}
              onChange={handleChange}
              placeholder="e.g. Italian"
            />
            {errors.cuisine ? (
              <div className="invalid-feedback">{errors.cuisine}</div>
            ) : null}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="phone">
              Phone <span className="text-danger">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              value={data.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
            {errors.phone ? (
              <div className="invalid-feedback">{errors.phone}</div>
            ) : null}
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="name">
              Restaurant name <span className="text-danger">*</span>
            </label>
            <input
              id="name"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={data.name}
              onChange={handleChange}
              placeholder="Restaurant name"
            />
            {errors.name ? (
              <div className="invalid-feedback">{errors.name}</div>
            ) : null}
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="address">
              Address <span className="text-danger">*</span>
            </label>
            <input
              id="address"
              name="address"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              value={data.address}
              onChange={handleChange}
              placeholder="Street address"
            />
            {errors.address ? (
              <div className="invalid-feedback">{errors.address}</div>
            ) : null}
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={data.description}
              onChange={handleChange}
              rows={4}
              placeholder="Short profile description"
            />
          </div>

          <div className="col-12">
            <div className="form-check form-switch">
              <input
                id="enabled"
                name="enabled"
                type="checkbox"
                className="form-check-input"
                checked={data.enabled}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="enabled">
                Restaurant is active
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className="form-label" htmlFor="imageUrl">
                Image URL
              </label>
              <input
                type="file"
                className="form-control"
                id="photo"
                accept="image/*"
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="col-md-6">
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
        </div>
      </div>

      <div className="card-footer bg-white d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
};

export default RestaurantForm;
