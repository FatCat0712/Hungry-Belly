import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import assets from "../../../shared/assets/assets";
import "../../../shared/styles/RestaurantForm.css";
import { useUpdateRestaurant } from "../hooks/useRestaurant";

const RestaurantForm = ({ selectedRestaurant }) => {
  const navigate = useNavigate();
  const { updateRestaurant } = useUpdateRestaurant();
  const [data, setData] = useState({
    id: selectedRestaurant?.id || null,
    name: selectedRestaurant?.name || "",
    cuisine: selectedRestaurant?.cuisine || "",
    phone: selectedRestaurant?.phone || "",
    address: selectedRestaurant?.address || "",
    description: selectedRestaurant?.description || "",
    enabled: selectedRestaurant?.enabled || false,
    photos: selectedRestaurant?.photos || [],
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddImage = () => {
    setData((prev) => ({
      ...prev,
      photos: [...prev.photos, ""],
    }));
  };

  // const handleRemoveImage = (index) => {
  //   setData((prev) => {
  //     const nextImages = prev.images.filter(
  //       (_, imageIndex) => imageIndex !== index,
  //     );

  //     return {
  //       ...prev,
  //       images: nextImages.length > 0 ? nextImages : [""],
  //     };
  //   });

  //   setErrors((prev) => {
  //     const nextErrors = { ...prev };
  //     delete nextErrors[`image-${index}`];
  //     return nextErrors;
  //   });
  // };

  const handleSetCoverImage = (index) => {
    setData((prev) => {
      let image = data.photos.at(index);

      if (!image) {
        return prev;
      }

      let nextImages = [...prev.photos];

      nextImages = nextImages.map((img) => ({
        ...img,
        type: "GALLERY",
        isPrimary: false,
      }));

      image = { ...image, type: "COVER", isPrimary: true };

      nextImages.splice(index, 1);
      nextImages.unshift(image);

      return {
        ...prev,
        photos: nextImages,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!data.id) {
      toast.error("Restaurant updates require an existing restaurant record.");
      return;
    }

    const cleanedImages = data.images
      .map((image) => image.trim())
      .filter(Boolean);
    const coverImage = cleanedImages[0] || "";

    try {
      setIsSaving(true);

      const payload = {
        name: data.name.trim(),
        cuisine: data.cuisine.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        description: data.description.trim(),
        enabled: data.enabled,
        photo: coverImage,
        imageUrl: coverImage,
        images: cleanedImages,
      };

      const response = await updateRestaurant({
        id: data.id,
        data: payload,
      });

      toast.success(response?.message || "Restaurant updated successfully");
      navigate(`/restaurants/${data.id}`);
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
                  src={data.photos[0]?.url || assets.upload}
                  alt={
                    data.photos[0]?.type
                      ? `${data.name || "Restaurant"} cover`
                      : "Upload placeholder"
                  }
                  className="restaurant-form__cover-image"
                />
              </div>
              <p className="text-muted small mb-0">
                The first image is used as the primary restaurant cover and list
                thumbnail.
              </p>
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
              </div>

              {errors.images ? (
                <div className="alert alert-danger py-2 px-3 mb-3">
                  {errors.images}
                </div>
              ) : null}

              <div className="restaurant-form__gallery-list">
                <div className="restaurant-form__gallery-row">
                  {data.photos.map((image, index) => {
                    const trimmedImage = image.url.trim();
                    const imageError = errors[`image-${index}`];

                    return (
                      <div key={`${index}-${trimmedImage || "empty"}`}>
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
                              onClick={() => handleSetCoverImage(index)}
                            >
                              Set as cover
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            // onClick={() => handleRemoveImage(index)}
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
