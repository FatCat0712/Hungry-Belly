import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeleteFood,
  useListFoodsByPage,
  useUpdateFoodStatus,
} from "../hooks/useFood";
import DeleteFoodConfirmDialog from "../components/DeleteFoodConfirmDialog";
import { useTableSearchParams } from "../../../shared/hooks/useTableSearchParams";
import Pagination from "../../../shared/ui/Pagination";
import Spinner from "../../../shared/ui/Spinner";
import { useDebounce } from "../../../shared/hooks/useDebounce";

export default function FoodManagement() {
  const pageSize = 10;
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    currentPage,
    sortField,
    sortDirection,
    keyword,
    setPage,
    updateParams,
  } = useTableSearchParams({ defaultSortField: "name" });

  const debouncedKeyword = useDebounce(keyword, 500);
  const normalizedKeyword = debouncedKeyword.trim().toLowerCase();

  const { data, isLoading } = useListFoodsByPage({
    pageNum: currentPage,
    pageSize,
    sortField,
    sortDirection,
    keyword: normalizedKeyword,
  });
  const { updateFoodStatus } = useUpdateFoodStatus();
  const { deleteFood } = useDeleteFood();

  const foods = data?.content || [];

  const totalElements = data?.totalElements ?? 0;
  const totalAvailable = data?.totalAvailable ?? 0;
  const totalUnavailable = data?.totalUnavailable ?? 0;

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

  const handleKeywordChange = (next) => {
    updateParams({ keyword: next }, { resetPage: true });
  };

  const handleToggleStatus = async (food) => {
    const response = await updateFoodStatus(food.id);
    if (response.status === 200) {
      const message = response.message;
      toast.success(message);
    }
  };

  const handleDeleteClick = (food) => {
    setFoodToDelete(food);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setFoodToDelete(null);
  };

  const handleConfirmDelete = async (id) => {
    await deleteFood(id);
    toast.success("Food item deleted successfully");
    handleCloseDeleteModal();
  };

  if (isLoading) {
    return <Spinner message="Loading foods..." />;
  }

  return (
    <>
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-start gap-2 mb-3">
          <div>
            <small className="text-uppercase text-secondary">Admin</small>
            <h1 className="h3 mb-1">Food Management</h1>
            <p className="text-muted mb-0">
              Manage food items and availability across all restaurants.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/foods/new")}
            >
              <i className="bi bi-plus-lg"></i> Add Food
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
                    <small className="text-muted">Total Items</small>
                    <h5 className="mb-0">{totalElements}</h5>
                  </div>
                  <i className="bi bi-egg-fried fs-4 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Available</small>
                    <h5 className="mb-0">{totalAvailable}</h5>
                  </div>
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Unavailable</small>
                    <h5 className="mb-0">{totalUnavailable}</h5>
                  </div>
                  <i className="bi bi-slash-circle-fill fs-4 text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
              <div>
                <h5 className="card-title mb-0">All Foods</h5>
                <small className="text-muted">
                  Sorted by {sortField} in {sortDirection}ending order
                </small>
              </div>
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
                    value={sortField}
                    onChange={(e) => handleSortFieldChange(e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="restaurant">Restaurant</option>
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
                    value={sortDirection}
                    onChange={(e) => handleSortDirectionChange(e.target.value)}
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
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search foods..."
                    value={keyword}
                    onChange={(e) => handleKeywordChange(e.target.value)}
                  />
                  {keyword && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleKeywordChange("")}
                    >
                      <i className="bi bi-x"></i>
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
                    <th>Food Item</th>
                    <th className="d-none d-md-table-cell">Category</th>
                    <th className="d-none d-lg-table-cell">Restaurant</th>
                    <th className="d-none d-lg-table-cell">Price</th>
                    <th className="text-center d-none d-md-table-cell">
                      Status
                    </th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-5">
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        No food items found
                      </td>
                    </tr>
                  ) : (
                    foods?.map((food, index) => (
                      <tr key={food.id}>
                        <td className="ps-3 text-muted small">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              style={{ width: 50, height: 40, flexShrink: 0 }}
                            >
                              {food.image_url ? (
                                <img
                                  src={food.image_url}
                                  alt={food.name}
                                  className="rounded"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div
                                  className="bg-secondary text-white rounded d-flex align-items-center justify-content-center"
                                  style={{ width: 50, height: 40 }}
                                >
                                  <i className="bi bi-egg-fried"></i>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="fw-semibold">{food.name}</div>
                              <small className="text-muted d-lg-none">
                                {food.cuisine}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell">
                          {food.categories.map((c) => (
                            <span className="badge bg-light text-dark" key={c}>
                              {c}
                            </span>
                          ))}
                        </td>
                        <td className="d-none d-lg-table-cell text-muted small">
                          {food.restaurant || food.restaurant_id}
                        </td>
                        <td className="d-none d-lg-table-cell fw-semibold">
                          {food.price != null
                            ? `$${Number(food.price).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="text-center d-none d-md-table-cell">
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 ${
                              food.available
                                ? "btn-success"
                                : "btn-outline-secondary"
                            }`}
                            role="switch"
                            aria-checked={food.available}
                            onClick={() => handleToggleStatus(food)}
                          >
                            <i
                              className={`bi ${
                                food.available
                                  ? "bi-toggle-on"
                                  : "bi-toggle-off"
                              }`}
                            ></i>
                            {food.available ? "Available" : "Unavailable"}
                          </button>
                        </td>
                        <td className="text-end pe-3">
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              className="btn btn-sm btn-outline-info"
                              title="View details"
                              onClick={() =>
                                navigate(`/foods/${food.id}`, {
                                  state: { food },
                                })
                              }
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              title="Edit food"
                              onClick={() =>
                                navigate(
                                  `/foods/${food.id}/edit${location.search}`,
                                )
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete food"
                              onClick={() => handleDeleteClick(food)}
                            >
                              <i className="bi bi-trash"></i>
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
              module="foods"
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalElements}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <DeleteFoodConfirmDialog
        open={showDeleteModal}
        onClose={handleCloseDeleteModal}
        food={foodToDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
