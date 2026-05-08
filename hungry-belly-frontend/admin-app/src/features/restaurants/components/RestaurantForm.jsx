import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import assets from "../../../shared/assets/assets";
import "../../../shared/styles/RestaurantForm.css";
import {
  appendUploadedImages,
  buildRestaurantImagePayload,
  removeImagePath,
  setCoverImageByPath,
  useCreateRestaurant,
  useUpdateRestaurant,
} from "../hooks/useRestaurant";

import CreateRestaurant from "../pages/CreateRestaurant";
import { useSyncedFormState } from "../../../shared/hooks/useSyncedFormState";
import { useEntityUploader } from "../../../shared/hooks/useEntityUploader";

const buildRestaurantFormData = (restaurant) => ({
  id: restaurant?.id || null,
  name: restaurant?.name || "",
  cuisine: restaurant?.cuisine || "",
  phone: restaurant?.phone || "",
  address: restaurant?.address || "",
  description: restaurant?.description || "",
  owner: restaurant?.owner || null,
  enabled: restaurant?.enabled || false,
  images: restaurant?.images || [],
});

const RestaurantForm = ({ selectedRestaurant }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { data, setData, setIsDirty } = useSyncedFormState(
    selectedRestaurant,
    buildRestaurantFormData,
  );
  const fileInputRef = useRef(null);
  const { updateRestaurant } = useUpdateRestaurant();
  const { createRestaurant } = useCreateRestaurant();
  const { uploadId, uploadFiles } = useEntityUploader({
    queryKey: "restaurants",
    entityType: "RESTAURANT",
  });

  const location = useLocation();

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    setIsDirty(true);
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const uploads = await uploadFiles(files);
    if (!uploads.length) return;

    setData((prev) => {
      return {
        ...prev,
        images: appendUploadedImages(prev.images, uploads),
      };
    });
  };

  const handleRemoveImage = (path) => {
    setIsDirty(true);

    setData((prev) => {
      return {
        ...prev,
        images: removeImagePath(prev.images, path),
      };
    });

    setErrors((prev) => {
      const nextErrors = { ...prev };
      Object.keys(nextErrors).forEach((key) => {
        if (key.startsWith("image-")) {
          delete nextErrors[key];
        }
      });
      return nextErrors;
    });
  };

  const handleSetCoverImage = (path) => {
    setIsDirty(true);
    setData((prev) => {
      return {
        ...prev,
        images: setCoverImageByPath(prev.images, path),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const imagePaths = buildRestaurantImagePayload(data.images, uploadId);

    try {
      setIsSaving(true);

      let payload = {
        name: data.name.trim(),
        cuisine: data.cuisine.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        description: data.description.trim(),
        enabled: data.enabled,
        images: imagePaths,
      };

      let response;

      if (data.id) {
        response = await updateRestaurant({
          id: data.id,
          data: payload,
        });
      } else {
        payload = { ...payload, owner: data.owner.trim() };
        response = await createRestaurant(payload);
      }

      toast.success(response?.message);
      navigate(`/restaurants${location.search}`);
    } catch (error) {
      const apiError = error.response?.data;
      console.error("API error:", apiError);
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

  const coverImage = data.images.find(
    (img) => img.status !== "removed" && img.isPrimary,
  );
  const galleryImages = data.images
    .filter((image) => image.status !== "removed")
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <form
      className="card border-0 shadow-sm restaurant-form"
      onSubmit={handleSubmit}
    >
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
          <div>
            <small className="restaurant-form__eyebrow">
              Restaurant profile
            </small>
            <h2 className="h4 mb-1">Core details and gallery</h2>
            <p className="text-muted mb-0">
              Keep the lead image first, then add supporting images for the
              detail page gallery.
            </p>
          </div>
          <div className="restaurant-form__status-pill">
            {data.enabled ? "Currently active" : "Currently inactive"}
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-7">
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  placeholder="Restaurant name"
                />
                {errors.name ? (
                  <div className="invalid-feedback">{errors.name}</div>
                ) : null}
              </div>

              {!data.id && (
                <div className="col-12">
                  <label className="form-label" htmlFor="owner">
                    Owner <span className="text-danger">*</span>
                  </label>
                  <input
                    id="owner"
                    name="owner"
                    className={`form-control ${errors.owner ? "is-invalid" : ""}`}
                    value={data.owner || ""}
                    onChange={handleInputChange}
                    placeholder="Owner name"
                  />
                  {errors.owner ? (
                    <div className="invalid-feedback">{errors.owner}</div>
                  ) : null}
                </div>
              )}

              <div className="col-12">
                <label className="form-label" htmlFor="address">
                  Address <span className="text-danger">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                  value={data.address}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  rows={5}
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
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="enabled">
                    Restaurant is active
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="restaurant-form__preview-card">
              <span className="restaurant-form__section-label">
                Cover preview
              </span>
              <div className="restaurant-form__cover-frame">
                <img
                  src={coverImage?.url || assets.upload}
                  alt={
                    coverImage?.type
                      ? `${data.name || "Restaurant"} cover`
                      : "Upload placeholder"
                  }
                  className="restaurant-form__cover-image"
                />
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="restaurant-form__gallery-card">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                <div>
                  <span className="restaurant-form__section-label">
                    Image gallery
                  </span>
                  <h3 className="h5 mb-1">Add multiple restaurant images</h3>
                  <p className="text-muted mb-0">
                    Paste image URLs, then move the strongest one to the cover
                    position.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleAddImage}
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Add image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                  hidden
                />
              </div>

              {errors.images ? (
                <div className="alert alert-danger py-2 px-3 mb-3">
                  {errors.images}
                </div>
              ) : null}

              <div className="restaurant-form__gallery-list">
                <div className="restaurant-form__gallery-row">
                  {galleryImages.map((image, index) => {
                    const trimmedImage = image.url.trim();
                    const imageError = errors[`image-${index}`];
                    if (image.status === "removed") {
                      return null;
                    }
                    return (
                      <div key={image.path}>
                        <div className="restaurant-form__gallery-fields">
                          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                            <span className="restaurant-form__image-order">
                              {index === 0
                                ? "Cover image"
                                : `Gallery image ${index + 1}`}
                            </span>
                          </div>

                          {imageError ? (
                            <div className="invalid-feedback d-block">
                              {imageError}
                            </div>
                          ) : null}
                        </div>
                        <div className="restaurant-form__gallery-thumb">
                          <img
                            src={trimmedImage || assets.upload}
                            alt={
                              trimmedImage
                                ? `Restaurant gallery ${index + 1}`
                                : "Gallery placeholder"
                            }
                            className="restaurant-form__gallery-thumb-image"
                          />
                        </div>
                        <div className="d-flex gap-2">
                          {index > 0 ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleSetCoverImage(image.path)}
                            >
                              Set as cover
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveImage(image.path)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer bg-white d-flex justify-content-end gap-2 px-4 py-3 px-lg-5">
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
