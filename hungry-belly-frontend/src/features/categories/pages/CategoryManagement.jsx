import { useState } from "react";
import { useListCategories } from "../hooks/useCategory";
import Spinner from "../../../shared/ui/Spinner";
import CategoryForm from "../components/CategoryForm";
import { useNavigate } from "react-router-dom";

const CategoryManagement = () => {
  const [keyword, setKeyword] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { categories, isLoadingCategories } = useListCategories();

  const navigate = useNavigate();

  const totalActive = categories?.filter((c) => c.status).length;
  const totalRestaurants = categories?.reduce(
    (sum, c) => sum + c.restaurantCount,
    0,
  );

  const filtered = categories?.filter((c) =>
    c.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  if (isLoadingCategories) {
    return <Spinner message="Loading categories" />;
  }

  return (
    <>
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-start gap-2 mb-3">
          <div>
            <small className="text-uppercase text-secondary">Admin</small>
            <h1 className="h3 mb-1">Category Management</h1>
            <p className="text-muted mb-0">
              Manage food categories displayed to customers and restaurants.
            </p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => {
              setSelectedCategory(null);
              setShowFormModal(true);
            }}
          >
            <i className="bi bi-plus-lg" /> Add Category
          </button>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-3">
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Total Categories</small>
                    <h5 className="mb-0">{categories?.length}</h5>
                  </div>
                  <i className="bi bi-grid fs-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Active</small>
                    <h5 className="mb-0">{totalActive}</h5>
                  </div>
                  <i className="bi bi-check-circle fs-4 text-success" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Restaurants Using</small>
                    <h5 className="mb-0">{totalRestaurants}</h5>
                  </div>
                  <i className="bi bi-shop fs-4 text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
              <h5 className="card-title mb-0">All Categories</h5>
              <div className="input-group" style={{ maxWidth: 280 }}>
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search categories..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                {keyword && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setKeyword("")}
                  >
                    <i className="bi bi-x" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3" style={{ width: 40 }}>
                      #
                    </th>
                    <th>
                      Name{" "}
                      <i className="bi bi-arrow-down-up text-muted small" />
                    </th>
                    <th>Description</th>
                    <th className="text-center">Restaurants</th>
                    <th className="text-center">Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-5">
                        <i className="bi bi-inbox fs-2 d-block mb-2" />
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((category, index) => (
                      <tr key={category.id}>
                        <td className="ps-3 text-muted small">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 40, height: 40 }}
                            >
                              {category.image ? (
                                <img
                                  src={category.image}
                                  alt="Category"
                                  className="rounded-circle"
                                  style={{ width: 40, height: 40 }}
                                />
                              ) : (
                                category.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <span className="fw-semibold">{category.name}</span>
                          </div>
                        </td>
                        <td className="text-muted small">
                          {category.description || (
                            <span className="fst-italic">No description</span>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark border">
                            <i className="bi bi-shop me-1" />
                            {category.restaurantCount}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="form-check form-switch d-inline-block mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              checked={category.enabled}
                              readOnly
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </td>
                        <td className="text-end pe-3">
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Edit"
                              onClick={() => {
                                navigate(`/categories/${category.id}/edit`);
                              }}
                            >
                              <i className="bi bi-pencil" />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowDeleteModal(true);
                              }}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-footer bg-white border-top">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
              <small className="text-muted">
                Showing {filtered.length} of {categories?.length} categories
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled">
                    <button className="page-link">Previous</button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>
                  <li className="page-item disabled">
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {showFormModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">
                  {selectedCategory ? "Edit Category" : "Create Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFormModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <CategoryForm
                  selectedCategory={selectedCategory}
                  onCancel={() => setShowFormModal(false)}
                  onSubmit={() => setShowFormModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && selectedCategory && (
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
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete{" "}
                  <strong>"{selectedCategory.name}"</strong>? This action cannot
                  be undone.
                </p>
                {selectedCategory.restaurantCount > 0 && (
                  <div className="alert alert-warning mt-3 mb-0 py-2">
                    <i className="bi bi-exclamation-triangle me-2" />
                    This category is used by{" "}
                    <strong>{selectedCategory.restaurantCount}</strong>{" "}
                    {selectedCategory.restaurantCount === 1
                      ? "restaurant"
                      : "restaurants"}
                    .
                  </div>
                )}
              </div>
              <div className="modal-footer border-top">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryManagement;
