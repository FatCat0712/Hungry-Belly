import { useState } from "react";
import {
  useExportCategories,
  useListRootCategories,
  useUpdateCategoryStatus,
} from "../hooks/useCategory";
import Spinner from "../../../shared/ui/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteCategoryConfirmDialog from "../components/DeleteCategoryConfirmDialog";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useTableSearchParams } from "../../../shared/hooks/useTableSearchParams";
import Pagination from "../../../shared/ui/Pagination";

const CategoryManagement = () => {
  const pageSize = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { exportCategories } = useExportCategories();
  const navigate = useNavigate();

  const {
    currentPage,
    sortField,
    sortDirection,
    keyword,
    setPage,
    updateParams,
  } = useTableSearchParams({
    defaultSortField: "name",
  });

  const debouncedKeyword = useDebounce(keyword, 500);
  const normalizedKeyword = debouncedKeyword.trim().toLowerCase();

  const { page, isLoadingCategories } = useListRootCategories({
    pageNum: currentPage,
    pageSize,
    sortField,
    sortDirection,
    keyword: normalizedKeyword,
  });
  const { updateCategoryStatus } = useUpdateCategoryStatus();

  const rootCategories = page?.content || [];
  const totalElements = page?.totalElements || 0;

  const totalActive = rootCategories?.filter((c) => c.enabled).length;
  const totalRestaurants = rootCategories?.reduce(
    (sum, c) => sum + c.restaurantCount,
    0,
  );

  const handlePageChange = (page) => {
    setPage(page, { totalItems: totalElements, pageSize });
  };

  const handleSortFieldChange = (field) => {
    updateParams(
      {
        sortField: field,
        sortDirection: sortDirection === "asc" ? "desc" : "asc",
      },
      { resetPage: true },
    );
  };

  const handleSortDirectionChange = (direction) => {
    updateParams({ sortDirection: direction }, { resetPage: true });
  };

  const handleKeywordChange = (nextKeyword) => {
    updateParams({ keyword: nextKeyword }, { resetPage: true });
  };

  const handleToggleStatus = async (id) => {
    const response = await updateCategoryStatus(id);
    const message = response?.message || "Category status updated";
    toast.success(message);
  };

  const handleExportCategories = async (format) => {
    toast.info("Exporting categories... Please wait.");
    const data = await exportCategories(format);
    window.open(data.downloadUrl);
  };

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
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-secondary d-flex align-items-center gap-2"
              onClick={() => handleExportCategories("excel")}
            >
              <i className="bi bi-download"></i> Export Excel
            </button>
            <button
              className="btn btn-info d-flex align-items-center gap-2"
              onClick={() => handleExportCategories("csv")}
            >
              <i className="bi bi-download"></i> Export CSV
            </button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => {
                navigate("/categories/new");
              }}
            >
              <i className="bi bi-plus-lg" /> Add Category
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-3">
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Total Categories</small>
                    <h5 className="mb-0">{totalElements}</h5>
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
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <div
                  className="input-group"
                  style={{ minWidth: 150, flex: "1 1 150px" }}
                >
                  <span className="input-group-text">
                    <i className="bi bi-bar-chart-line-fill"></i>
                  </span>
                  <select
                    className="form-select"
                    aria-label="Sort by"
                    onChange={(e) => {
                      handleSortFieldChange(e.target.value);
                    }}
                    value={sortField}
                  >
                    <option value="name">Name</option>
                  </select>
                </div>

                <div
                  className="input-group"
                  style={{ minWidth: 150, flex: "1 1 150px" }}
                >
                  <span className="input-group-text">
                    <i className="bi bi-sort-down"></i>
                  </span>
                  <select
                    className="form-select"
                    aria-label="Sort direction"
                    onChange={(e) => {
                      handleSortDirectionChange(e.target.value);
                    }}
                    value={sortDirection}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <div
                  className="input-group"
                  style={{ minWidth: 200, flex: "2 1 200px" }}
                >
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search categories..."
                    value={keyword}
                    onChange={(e) => handleKeywordChange(e.target.value)}
                  />
                  {keyword && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleKeywordChange("")}
                    >
                      <i className="bi bi-x" />
                    </button>
                  )}
                </div>
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
                    <th className="text-center">Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rootCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-5">
                        <i className="bi bi-inbox fs-2 d-block mb-2" />
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    rootCategories.map((category, index) => (
                      <tr key={category.id}>
                        <td className="ps-3 text-muted smaller">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
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
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 ${
                              category.enabled
                                ? "btn-success"
                                : "btn-outline-secondary"
                            }`}
                            role="switch"
                            aria-checked={category.enabled}
                            aria-label={
                              category.enabled ? "Set inactive" : "Set active"
                            }
                            onClick={() => handleToggleStatus(category.id)}
                          >
                            <i
                              className={`bi ${
                                category.enabled
                                  ? "bi-toggle-on"
                                  : "bi-toggle-off"
                              }`}
                            />
                            {category.enabled ? "Active" : "Inactive"}
                          </button>
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
            <Pagination
              module="categories"
              pageData={page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <DeleteCategoryConfirmDialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        category={selectedCategory}
      />
    </>
  );
};

export default CategoryManagement;
