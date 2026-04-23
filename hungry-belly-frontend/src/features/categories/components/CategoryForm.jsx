import { useState } from "react";
import { useSyncedFormState } from "../../../shared/hooks/useSyncedFormState";
import assets from "../../../shared/assets/assets";
import { useNavigate } from "react-router-dom";
import { useGetCategoryTree, useUpdateCategory } from "../hooks/useCategory";
import { toast } from "react-toastify";
import { useEntityUploader } from "../../../shared/hooks/useEntityUploader";

const buildCategoryFormData = (selectedCategory) => ({
  id: selectedCategory?.id || null,
  name: selectedCategory?.name || "",
  alias: selectedCategory?.alias || "",
  description: selectedCategory?.description || "",
  enabled: selectedCategory?.enabled ?? true,
  parentId: selectedCategory?.parentId || null,
  image: selectedCategory?.image || null,
  imageUrl: selectedCategory?.imageUrl || null,
});

export const CategoryForm = ({ selectedCategory }) => {
  const { data, setData, setIsDirty } = useSyncedFormState(
    selectedCategory,
    buildCategoryFormData,
  );
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { categoryTree, isLoadingCategoryTree } = useGetCategoryTree();
  const { updateCategory } = useUpdateCategory();
  const { uploadFiles } = useEntityUploader({
    queryKey: "categories",
    entityType: "CATEGORY",
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

  const handleImageChange = async (event) => {
    setIsDirty(true);
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const file = files.find((file) => file.size > 2 * 1024 * 1024);
    if (file) {
      setErrors((prev) => ({
        ...prev,
        photo: "File size should be less than 2MB",
      }));
      return;
    }

    const uploads = await uploadFiles(files);

    setData((prev) => ({
      ...prev,
      image: uploads[0].path,
      imageUrl: uploads[0].publicUrl,
    }));
    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    try {
      let response;
      if (data.id) {
        response = await updateCategory({ id: data.id, data });
      }
      if (response.status === 200) {
        toast.success(response.message);
        navigate("/categories");
      }
      console.log(response);
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
    <div>
      <div className="border-bottom mb-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
              placeholder="e.g. Fast Food"
              maxLength={100}
              required
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            <div className="form-text">
              The category name displayed to customers and restaurants.
            </div>
          </div>

          <div className="mb-3 row">
            <div className="col-12 col-md-6">
              <label htmlFor="alias" className="form-label">
                Alias
              </label>
              <input
                type="text"
                className="form-control"
                id="alias"
                name="alias"
                value={data.alias}
                onChange={handleInputChange}
                placeholder="e.g. fast-food"
                maxLength={100}
                required
              />
              {errors.alias && <p style={{ color: "red" }}>{errors.alias}</p>}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="alias" className="form-label">
                Parent Category
              </label>
              {isLoadingCategoryTree ? (
                <p>Loading category tree...</p>
              ) : (
                <select
                  className="form-control"
                  name="parentId"
                  value={data.parentId || ""}
                  onChange={handleInputChange}
                >
                  <option value={""}>No Parent</option>
                  {categoryTree?.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                      selected={data.parentId === cat.id}
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
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
              {data.description.length}
              /255
            </div>
            <div className="form-text">
              A short summary shown on storefront filters. Optional.
            </div>
            {errors.description && (
              <p style={{ color: "red" }}>{errors.description}</p>
            )}
          </div>

          <div className="mb-3 d-flex">
            <div className="form-label me-4">Enabled:</div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="enabled"
                name="enabled"
                checked={data.enabled}
                onChange={handleInputChange}
              />
            </div>
            {errors.enabled && <p style={{ color: "red" }}>{errors.enabled}</p>}
            <div className="form-text">
              Inactive categories are hidden from ordering flows.
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
                  onChange={handleImageChange}
                />
              </div>
              {errors.photo && <p style={{ color: "red" }}>{errors.photo}</p>}
              <div className="form-check mt-1">
                <label className="form-label" htmlFor="useDefault">
                  <img
                    src={data.imageUrl ? data.imageUrl : assets.upload}
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
          Create
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
