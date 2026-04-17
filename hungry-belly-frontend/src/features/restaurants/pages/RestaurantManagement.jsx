import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../auth/context/auth-context";
import {
  useListRestaurantsByPage,
  useUpdateRestaurantStatus,
} from "../hooks/useRestaurant";
import AccessDenied from "../../access/pages/AccessDenied";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import Pagination from "../../../shared/ui/Pagination";
import Spinner from "../../../shared/ui/Spinner";

export default function RestaurantManagement() {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 500);
  const normalizedKeyword = debouncedKeyword.trim().toLowerCase();

  const navigate = useNavigate();
  const { user: loggedInUser } = useContext(AuthContext);

  const { data, isLoading: isLoadingRestaurants } = useListRestaurantsByPage({
    pageNum: currentPage,
    pageSize,
    sortField,
    sortDirection,
    keyword: normalizedKeyword || "",
  });

  const restaurants = data?.content || [];
  const totalElements = data?.totalElements || 0;

  const { updateRestaurantStatus } = useUpdateRestaurantStatus();

  // Filter and sort restaurants
  const handlePageChange = (page) => {
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  const handleDeleteClick = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirmModal(false);
    setRestaurantToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (restaurantToDelete) {
      toast.success(`${restaurantToDelete.name} deleted successfully`);
      handleCloseDeleteModal();
    }
  };

  const toggleRestaurantStatus = async (restaurant) => {
    const newStatus = !restaurant.status;

    await updateRestaurantStatus(restaurant.id);

    const message = newStatus
      ? `${restaurant.name} has been enabled`
      : `${restaurant.name} has been disabled`;
    toast.success(message);
  };

  if (loggedInUser?.roles.includes("ROLE_ADMIN") === false) {
    return <AccessDenied />;
  }

  if (!data && isLoadingRestaurants) {
    return <Spinner message="Loading restaurants..." />;
  }

  return (
    <>
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-start gap-2 mb-3">
          <div>
            <small className="text-uppercase text-secondary">Admin</small>
            <h1 className="h3 mb-1">Restaurant Management</h1>
            <p className="text-muted mb-0">
              Manage restaurants, ratings, and operational status.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/restaurants/new")}
            >
              <i className="bi bi-plus-lg"></i> Add Restaurant
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Total Restaurants</small>
                    <h5 className="mb-0">{totalElements}</h5>
                  </div>
                  <i className="bi bi-shop fs-4 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Active Restaurants</small>
                    <h5 className="mb-0">{0}</h5>
                  </div>
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <small className="text-muted">Pending Approval</small>
                    <h5 className="mb-0">{0}</h5>
                  </div>
                  <i className="bi bi-clock-fill fs-4 text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center gap-2 mb-3">
              <div>
                <h5 className="card-title mb-0">All Restaurants</h5>
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
                    onChange={(e) => {
                      setSortField(e.target.value);
                      setCurrentPage(1);
                    }}
                    value={sortField}
                  >
                    <option value="name">Name</option>
                    <option value="cuisine">Cuisine</option>
                    <option value="rating">Rating</option>
                    <option value="orders">Orders</option>
                    <option value="owner">Owner</option>
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
                      setSortDirection(e.target.value);
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
                  <span className="input-group-text" id="search-addon">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search restaurants..."
                    aria-label="Search restaurants"
                    aria-describedby="search-addon"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive position-relative">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Restaurant</th>
                    <th className="d-none d-lg-table-cell">Cuisine</th>
                    <th className="d-none d-md-table-cell">Owner</th>
                    <th className="d-none d-lg-table-cell">Rating</th>
                    <th className="d-none d-lg-table-cell">Orders</th>
                    <th className="d-none d-md-table-cell">Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.length > 0 ? (
                    restaurants.map((restaurant) => (
                      <tr key={restaurant.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ width: 50, height: 40 }}>
                              <img
                                src={restaurant.path}
                                alt={restaurant.name}
                                className="rounded"
                                style={{ width: "100%", height: "100%" }}
                              />
                            </div>
                            <div className="d-flex flex-column">
                              <span
                                className="fw-semibold text-truncate d-md-none"
                                style={{ maxWidth: 140 }}
                              >
                                {restaurant.name}
                              </span>
                              <small
                                className="text-muted d-md-none text-truncate"
                                style={{ maxWidth: 140 }}
                              >
                                {restaurant.cuisine}
                              </small>
                            </div>
                            <span className="d-none d-md-inline fw-semibold">
                              {restaurant.name}
                            </span>
                          </div>
                        </td>
                        <td className="d-none d-lg-table-cell">
                          <span className="badge bg-light text-dark">
                            {restaurant.cuisine}
                          </span>
                        </td>
                        <td className="d-none d-md-table-cell">
                          {restaurant.owner}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          <div className="d-flex align-items-center gap-1">
                            <i className="bi bi-star-fill text-warning"></i>
                            <span className="fw-semibold">
                              {restaurant.rating}
                            </span>
                          </div>
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {restaurant.orders}
                        </td>
                        <td className="d-none d-md-table-cell">
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 ${
                              restaurant.enabled
                                ? "btn-success"
                                : "btn-outline-secondary"
                            }`}
                            role="switch"
                            aria-checked={restaurant.enabled}
                            onClick={() => toggleRestaurantStatus(restaurant)}
                          >
                            <i
                              className={`bi ${
                                restaurant.enabled
                                  ? "bi-toggle-on"
                                  : "bi-toggle-off"
                              }`}
                            ></i>
                            {restaurant.enabled ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td>
                          <div className="d-flex justify-content-end flex-wrap gap-1">
                            <button
                              type="button"
                              className={`btn btn-sm d-inline-flex d-md-none align-items-center ${
                                restaurant.status
                                  ? "btn-success"
                                  : "btn-outline-secondary"
                              }`}
                              role="switch"
                              aria-checked={restaurant.status}
                              onClick={() => toggleRestaurantStatus(restaurant)}
                              title={
                                restaurant.status
                                  ? "Disable restaurant"
                                  : "Enable restaurant"
                              }
                            >
                              <i
                                className={`bi ${
                                  restaurant.status
                                    ? "bi-check-circle-fill"
                                    : "bi-check-circle"
                                }`}
                              ></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => {
                                navigate(`/restaurants/${restaurant.id}`, {
                                  state: { restaurant },
                                });
                              }}
                              title="View details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                navigate(`/restaurants/${restaurant.id}/edit`);
                              }}
                              title="Edit restaurant"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteClick(restaurant)}
                              title="Delete restaurant"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No restaurants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && restaurantToDelete && (
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
                  onClick={handleCloseDeleteModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete{" "}
                  <strong>{restaurantToDelete.name}</strong>? This action cannot
                  be undone.
                </p>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDeleteModal}
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
      )}

      <Pagination
        module="restaurants"
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalItems={totalElements}
      />
    </>
  );
}
