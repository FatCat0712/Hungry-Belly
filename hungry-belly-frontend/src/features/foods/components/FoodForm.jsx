import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import assets from "../../../shared/assets/assets";
import { useEntityUploader } from "../../../shared/hooks/useEntityUploader";
import { useSyncedFormState } from "../../../shared/hooks/useSyncedFormState";
import {
  appendUploadedFoodImages,
  buildFoodImagePayload,
  removeFoodImagePath,
  setFoodCoverImageByPath,
  useCreateFood,
  useUpdateFood,
} from "../hooks/useFood";
import { useGetCategoryTree } from "../../categories/hooks/useCategory";
import { useListRestaurantsByPage } from "../../restaurants/hooks/useRestaurant";
import { useDebounce } from "../../../shared/hooks/useDebounce";

const buildFoodFormData = (food) => ({
  id: food?.id || null,
  name: food?.name || "",
  description: food?.description || "",
  price: food?.price ?? "",
  restaurant: food?.restaurant || "",
  categories: food?.categories || [],
  available: food?.available ?? true,
  images: food?.images || [],
});

export default function FoodForm({ selectedFood }) {
  const { data, setData, setIsDirty } = useSyncedFormState(
    selectedFood,
    buildFoodFormData,
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showRestaurantHints, setShowRestaurantHints] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryTree, isLoadingCategoryTree } = useGetCategoryTree();
  const debouncedRestaurant = useDebounce(data.restaurant, 300);
  const { data: restaurantPage } = useListRestaurantsByPage({
    pageNum: 1,
    pageSize: 6,
    sortField: "name",
    sortDirection: "asc",
    keyword: debouncedRestaurant,
  });
  const restaurantHints = restaurantPage?.content || [];

  const { createFood } = useCreateFood();
  const { updateFood } = useUpdateFood();
  const { uploadId, uploadFiles } = useEntityUploader({
    queryKey: "foods",
    entityType: "FOOD",
  });

  const handleInputChange = (event) => {
    setIsDirty(true);
    const { name, value, type, checked } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    setIsDirty(true);
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const file = files.find((nextFile) => nextFile.size > 2 * 1024 * 1024);
    if (file) {
      setErrors((prev) => ({
        ...prev,
        image: "File size should be less than 2MB",
      }));
      return;
    }

    const uploads = await uploadFiles(files);
    if (!uploads?.length) return;

    setData((prev) => ({
      ...prev,
      images: appendUploadedFoodImages(prev.images, uploads),
    }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoveImage = (path) => {
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      images: removeFoodImagePath(prev.images, path),
    }));
  };

  const handleSetCoverImage = (path) => {
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      images: setFoodCoverImageByPath(prev.images, path),
    }));
  };

  const addCategoryTag = (rawValue) => {
    const nextTag = rawValue.trim().replace(/-/g, ""); // Remove hyphens to prevent confusion
    if (!nextTag) return;

    const isDuplicate = data.categories.some(
      (existing) => existing.toLowerCase() === nextTag.toLowerCase(),
    );
    if (isDuplicate) return;

    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, nextTag],
    }));
    setErrors((prev) => ({ ...prev, categories: "" }));
  };

  const handleRemoveCategory = (indexToRemove) => {
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryList = data.categories;

    if (!categoryList.length) {
      setErrors((prev) => ({
        ...prev,
        categories: "At least one category is required",
      }));
      return;
    }

    const payload = {
      id: data.id,
      name: data.name.trim(),
      description: data.description.trim(),
      price: data.price === "" ? null : Number(data.price),
      restaurant: data.restaurant.trim(),
      categories: categoryList,
      available: data.available,
      images: buildFoodImagePayload(data.images, uploadId),
    };

    try {
      setIsSaving(true);

      let response;

      if (data.id) {
        response = await updateFood({ id: data.id, data: payload });
      } else {
        response = await createFood(payload);
      }

      toast.success(response?.message || "Food saved successfully");
      navigate(`/foods${location.search}`);
    } catch (error) {
      const apiMessage = error.response?.data?.message;

      if (apiMessage && typeof apiMessage === "object") {
        setErrors((prev) => ({ ...prev, ...apiMessage }));
        return;
      }

      toast.error(apiMessage || error.message || "Failed to save food");
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
    <div>
      <div className="border-bottom mb-2">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={data.name}
                onChange={handleInputChange}
                placeholder="e.g. Volcano Chicken Burger"
                required
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>
            <div className="col-md-6">
              <label htmlFor="price" className="form-label">
                Price <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                id="price"
                name="price"
                value={data.price}
                onChange={handleInputChange}
                required
              />
              {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="categories" className="form-label">
              Categories <span className="text-danger">*</span>
            </label>
            <div className="border rounded p-2 bg-white">
              <div className="d-flex flex-wrap gap-2 mb-2">
                {data.categories.map((category, index) => (
                  <span
                    key={`${category}-${index}`}
                    className="badge text-bg-secondary d-inline-flex align-items-center gap-2 py-2 px-3"
                  >
                    {category}
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-white p-0 border-0"
                      onClick={() => handleRemoveCategory(index)}
                      aria-label={`Remove ${category}`}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </span>
                ))}
              </div>
              <div className="input-group">
                {isLoadingCategoryTree ? (
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Loading categories..."
                    disabled
                  />
                ) : (
                  <select
                    className="form-select border-0"
                    id="categories"
                    value=""
                    onChange={(event) => {
                      if (event.target.value)
                        addCategoryTag(event.target.value);
                    }}
                  >
                    <option value="">-- Select a category --</option>
                    {categoryTree
                      ?.filter(
                        (cat) =>
                          !data.categories.some(
                            (selected) =>
                              selected.toLowerCase() === cat.name.toLowerCase(),
                          ),
                      )
                      .map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                )}
              </div>
              <div className="form-text">
                Select from the list to add a category tag.
              </div>

              {errors.categories && (
                <p style={{ color: "red" }}>{errors.categories}</p>
              )}
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="restaurant" className="form-label">
              Restaurant <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="restaurant"
              name="restaurant"
              autoComplete="off"
              value={data.restaurant}
              onChange={(e) => {
                handleInputChange(e);
                setShowRestaurantHints(true);
              }}
              onFocus={() => setShowRestaurantHints(true)}
              onBlur={() =>
                setTimeout(() => setShowRestaurantHints(false), 150)
              }
              placeholder="Restaurant name"
              required
            />
            {showRestaurantHints && restaurantHints.length > 0 && (
              <ul
                className="list-group position-absolute w-100 shadow-sm"
                style={{ zIndex: 1000, top: "100%" }}
              >
                {restaurantHints.map((r) => (
                  <li
                    key={r.id}
                    className="list-group-item list-group-item-action py-2 px-3"
                    style={{ cursor: "pointer" }}
                    onMouseDown={() => {
                      setData((prev) => ({ ...prev, restaurant: r.name }));
                      setIsDirty(true);
                      setErrors((prev) => ({ ...prev, restaurant: "" }));
                      setShowRestaurantHints(false);
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={r.path || assets.upload}
                        alt={r.name}
                        width={32}
                        height={32}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                      <span>{r.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {errors.restaurant && (
              <p style={{ color: "red" }}>{errors.restaurant}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={data.description}
              onChange={handleInputChange}
              rows={4}
              maxLength={255}
              placeholder="Short description"
            />
            <div className="form-text text-end">
              {data.description.length}/255
            </div>
            {errors.description && (
              <p style={{ color: "red" }}>{errors.description}</p>
            )}
          </div>

          <div className="mb-3 d-flex align-items-center gap-3">
            <div className="form-label mb-0">Available:</div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="available"
                name="available"
                checked={data.available}
                onChange={handleInputChange}
              />
            </div>
            {errors.available && (
              <p className="mb-0" style={{ color: "red" }}>
                {errors.available}
              </p>
            )}
          </div>

          <div className="mb-3">
            <div className="row g-3">
              <div className="col-12 col-lg-4">
                <div className="border rounded p-3 h-100 bg-white">
                  <div className="text-uppercase small fw-bold text-secondary mb-2">
                    Cover preview
                  </div>
                  <div
                    className="rounded overflow-hidden border"
                    style={{ minHeight: 220 }}
                  >
                    <img
                      src={coverImage?.url || assets.upload}
                      alt={
                        data.name ? `${data.name} cover` : "Upload placeholder"
                      }
                      style={{ width: "100%", height: 220, objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-8">
                <div className="border rounded p-3 h-100 bg-white">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                    <div>
                      <label className="form-label mb-1">Image gallery</label>
                      <div className="text-muted small">
                        Upload multiple images and choose one as cover.
                      </div>
                    </div>
                    <div className="d-flex gap-2">
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
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        multiple
                        hidden
                      />
                    </div>
                  </div>

                  <div className="row g-3">
                    {galleryImages.map((image, index) => (
                      <div
                        className="col-12 col-md-6"
                        key={image.path || `image-${index}`}
                      >
                        <div className="border rounded p-2 h-100">
                          <img
                            src={image.url || image.imageUrl || assets.upload}
                            alt={`Food image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                            }}
                            className="rounded"
                          />
                          <div className="small fw-semibold mt-2">
                            {index === 0 || image.isPrimary
                              ? "Cover image"
                              : `Image ${index + 1}`}
                          </div>
                          <div className="d-flex gap-2 mt-2">
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
                      </div>
                    ))}

                    {data.images.length === 0 ? (
                      <div className="col-12">
                        <div className="border rounded p-3 text-muted">
                          No images uploaded yet.
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {errors.image && <p style={{ color: "red" }}>{errors.image}</p>}
            {errors.images && <p style={{ color: "red" }}>{errors.images}</p>}
          </div>
        </form>
      </div>

      <div className="modal-footer gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : data.id ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}
