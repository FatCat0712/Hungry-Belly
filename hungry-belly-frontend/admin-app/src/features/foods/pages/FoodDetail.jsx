import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetFoodById } from "../hooks/useFood";
import Spinner from "../../../shared/ui/Spinner";
import "../../../shared/styles/FoodDetail.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";

export default function FoodDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const seededFood = location.state?.food;
  const { food, isLoading } = useGetFoodById(id);

  const item = food ?? seededFood;

  console.log(item);

  if (!item && isLoading) {
    return <Spinner message="Loading food details..." />;
  }

  if (!item) {
    return (
      <div className="container-fluid px-0">
        <div className="alert alert-danger border-0 shadow-sm">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="h4 mb-1">Food item not available</h1>
              <p className="mb-0 text-danger-emphasis">
                The food details could not be loaded.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => navigate("/foods")}
            >
              Back to foods
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(item.images) ? item.images : [];
  const coverImage =
    images.find((img) => img.isPrimary)?.url ?? PLACEHOLDER_IMAGE;

  const description = item.description || "No description added yet.";

  const categories = Array.isArray(item.categories) ? item.categories : [];

  return (
    <div className="food-detail-page container-fluid px-0">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="food-hero card border-0 shadow-sm mb-4">
        <div
          className="food-hero__image"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className="food-hero__overlay" />

        <div className="card-body food-hero__content">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
            {/* Left copy */}
            <div className="food-hero__copy">
              <button
                type="button"
                className="btn btn-sm food-hero__back"
                onClick={() => navigate("/foods")}
              >
                <i className="bi bi-arrow-left"></i> Foods
              </button>

              <h1
                className="display-6 fw-bold mb-2"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                {item.name}
              </h1>

              <p className="food-hero__lead mb-3">{description}</p>

              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="food-price-badge">
                  <i className="bi bi-tag-fill"></i>
                  {item.price != null
                    ? currencyFormatter.format(item.price)
                    : "Price not set"}
                </span>

                <span
                  className={`food-status-pill ${item.available ? "available" : "unavailable"}`}
                >
                  <i
                    className={`bi ${item.available ? "bi-check-circle-fill" : "bi-slash-circle-fill"}`}
                  ></i>
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            {/* Right quick-info glass card */}
            <div style={{ width: "min(100%, 300px)" }}>
              <div
                className="p-3 rounded-4"
                style={{
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,248,239,0.13)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 24px 60px rgba(7,9,15,0.22)",
                }}
              >
                <h6
                  className="text-uppercase mb-3"
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Quick Info
                </h6>

                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                  <li className="d-flex align-items-start gap-2 text-white">
                    <i className="bi bi-shop mt-1" style={{ opacity: 0.7 }}></i>
                    <div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.65 }}>
                        Restaurant
                      </div>
                      <div
                        className="fw-semibold"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {item.restaurant || "—"}
                      </div>
                    </div>
                  </li>

                  <li className="d-flex align-items-start gap-2 text-white">
                    <i className="bi bi-grid mt-1" style={{ opacity: 0.7 }}></i>
                    <div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.65 }}>
                        Categories
                      </div>
                      <div
                        className="d-flex flex-wrap gap-1 mt-1"
                        style={{ fontSize: "0.82rem" }}
                      >
                        {categories.length > 0 ? (
                          categories.map((c) => (
                            <span
                              key={c}
                              className="badge"
                              style={{
                                background: "rgba(255,255,255,0.18)",
                                color: "#fff",
                                fontWeight: 500,
                              }}
                            >
                              {c}
                            </span>
                          ))
                        ) : (
                          <span style={{ opacity: 0.7 }}>—</span>
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Action bar ──────────────────────────────── */}
      <div className="d-flex justify-content-end gap-2 mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/foods")}
        >
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate(`/foods/${id}/edit`)}
        >
          <i className="bi bi-pencil me-1"></i> Edit Food
        </button>
      </div>

      {/* ── Details grid ────────────────────────────── */}
      <div className="row g-4 mb-4">
        {/* Left column: Description + Photos */}
        <div className="col-lg-8 d-flex flex-column gap-4">
          {/* Description card */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-file-text text-primary"></i>
              <h5 className="card-title mb-0">Description</h5>
            </div>
            <div className="card-body">{description}</div>
          </div>

          {/* Photos card */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-images text-primary"></i>
              <h5 className="card-title mb-0">
                Photos{" "}
                <span className="badge bg-secondary ms-1">{images.length}</span>
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {images.map((img, idx) => (
                  <div
                    key={img.url ?? idx}
                    className={`col-6 col-md-4 ${img.isPrimary ? "col-12 col-md-8" : ""}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt ?? `${item.name} photo ${idx + 1}`}
                      className={`food-gallery-img shadow-sm ${img.isPrimary ? "cover-img" : ""}`}
                    />
                    {img.isPrimary && (
                      <div className="mt-1 text-center">
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-star-fill me-1"></i>Cover
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Details */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-info-circle text-primary"></i>
              <h5 className="card-title mb-0">Details</h5>
            </div>
            <div className="card-body d-flex flex-column gap-3">
              <div className="food-info-card p-3">
                <div className="info-label">Price</div>
                <div className="info-value fs-5">
                  {item.price != null
                    ? currencyFormatter.format(item.price)
                    : "—"}
                </div>
              </div>

              <div className="food-info-card p-3">
                <div className="info-label">Restaurant</div>
                <div className="info-value">{item.restaurant || "—"}</div>
              </div>

              <div className="food-info-card p-3">
                <div className="info-label">Availability</div>
                <div className="mt-1">
                  <span
                    className={`food-status-pill ${item.available ? "available" : "unavailable"}`}
                  >
                    <i
                      className={`bi ${item.available ? "bi-check-circle-fill" : "bi-slash-circle-fill"}`}
                    ></i>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="food-info-card p-3">
                <div className="info-label">Categories</div>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <span key={c} className="badge bg-light text-dark border">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
