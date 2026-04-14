import { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../auth/context/auth-context";
import { useRestaurantDetail } from "../hooks/useRestaurant";
import AccessDenied from "../../access/pages/AccessDenied";
import "../../../shared/styles/RestaurantDetails.css";
import Spinner from "../../../shared/ui/Spinner";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const pickFirst = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
};

const formatHours = (hours) => {
  if (!hours) {
    return "Hours not provided";
  }

  if (typeof hours === "string") {
    return hours;
  }

  if (Array.isArray(hours)) {
    return hours.join(" • ");
  }

  if (typeof hours === "object") {
    return Object.entries(hours)
      .map(([day, value]) => `${day}: ${value}`)
      .join(" • ");
  }

  return "Hours not provided";
};

const formatMinimumOrder = (value) => {
  if (typeof value === "number") {
    return currencyFormatter.format(value);
  }

  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }

  return "Not specified";
};

const formatMetric = (value, suffix = "") => {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }

  return `${value}${suffix}`;
};

const sampleRestaurantImages = [
  {
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    alt: "Warm dining room with prepared tables",
  },
  {
    src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
    alt: "Restaurant terrace with ambient lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    alt: "Signature plated dish served in a modern restaurant",
  },
  {
    src: "https://images.unsplash.com/photo-1515669097368-22e68427d265?auto=format&fit=crop&w=900&q=80",
    alt: "Chef preparing food in an open kitchen",
  },
];

const normalizeGalleryImages = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          src: item,
          alt: `Restaurant gallery image ${index + 1}`,
        };
      }

      const src =
        item?.imageUrl || item?.url || item?.src || item?.photoUrl || null;

      if (!src) {
        return null;
      }

      return {
        src,
        alt:
          item?.alt ||
          item?.caption ||
          item?.title ||
          `Restaurant gallery image ${index + 1}`,
      };
    })
    .filter(Boolean);
};

export default function RestaurantDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user: loggedInUser } = useContext(AuthContext);
  const seededRestaurant = location.state?.restaurant;

  const {
    data: restaurant,
    isLoading,
    isError,
    error,
  } = useRestaurantDetail(id, seededRestaurant);

  if (loggedInUser?.roles.includes("ROLE_ADMIN") === false) {
    return <AccessDenied />;
  }

  if (!restaurant && isLoading) {
    return <Spinner message="Loading restaurant details..." />;
  }

  if (!restaurant && isError) {
    return (
      <div className="container-fluid px-0">
        <div className="alert alert-danger border-0 shadow-sm">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="h4 mb-1">Restaurant not available</h1>
              <p className="mb-0 text-danger-emphasis">
                {error?.response?.data?.message ||
                  "The restaurant details could not be loaded."}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => navigate("/restaurants")}
            >
              Back to restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  const restaurantName = restaurant?.name || "Restaurant";
  const cuisine = pickFirst(restaurant, ["cuisine", "category", "type"]);
  const rating = pickFirst(restaurant, ["rating", "averageRating"]);
  const orders = pickFirst(restaurant, [
    "orders",
    "orderCount",
    "completedOrders",
  ]);
  const owner = pickFirst(restaurant, ["owner", "ownerName", "managerName"]);
  const description = pickFirst(restaurant, [
    "description",
    "shortDescription",
    "about",
  ]);
  const address = pickFirst(restaurant, [
    "address",
    "fullAddress",
    "location",
    "streetAddress",
  ]);
  const phone = pickFirst(restaurant, [
    "phoneNumber",
    "phone",
    "contactNumber",
  ]);
  const email = pickFirst(restaurant, ["email", "contactEmail"]);
  const deliveryTime = pickFirst(restaurant, [
    "deliveryTime",
    "estimatedDeliveryTime",
  ]);
  const priceRange = pickFirst(restaurant, ["priceRange", "priceTier"]);
  const minimumOrder = pickFirst(restaurant, [
    "minimumOrder",
    "minimumOrderAmount",
  ]);
  const heroImage =
    pickFirst(restaurant, ["imageUrl", "bannerUrl", "coverImageUrl"]) ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";
  const galleryImagesFromData = normalizeGalleryImages(
    pickFirst(restaurant, ["images", "gallery", "photos", "media"]),
  );
  const galleryImages =
    galleryImagesFromData.length > 0
      ? galleryImagesFromData
      : sampleRestaurantImages.map((image, index) => ({
          ...image,
          alt: `${restaurantName} sample image ${index + 1}: ${image.alt}`,
        }));
  const isUsingSampleGallery = galleryImagesFromData.length === 0;
  const featureTags = ensureArray(
    pickFirst(restaurant, ["categories", "tags", "features"]),
  );
  const openingHours = formatHours(
    pickFirst(restaurant, ["openingHours", "businessHours", "hours"]),
  );
  const isActive = Boolean(restaurant?.enabled);

  return (
    <div className="restaurant-details-page container-fluid px-0">
      <section className="restaurant-hero card border-0 overflow-hidden shadow-sm mb-4">
        <div
          className="restaurant-hero__image"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="restaurant-hero__overlay" />
        <div className="card-body restaurant-hero__content">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
            <div className="restaurant-hero__copy">
              <button
                type="button"
                className="btn btn-sm restaurant-hero__back"
                onClick={() => navigate("/restaurants")}
              >
                <i className="bi bi-arrow-left-short fs-5"></i>
                All restaurants
              </button>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {cuisine ? (
                  <span className="restaurant-chip restaurant-chip--light">
                    {cuisine}
                  </span>
                ) : null}
                <span
                  className={`restaurant-chip ${
                    isActive
                      ? "restaurant-chip--success"
                      : "restaurant-chip--muted"
                  }`}
                >
                  {isActive ? "Operating" : "Inactive"}
                </span>
                <span className="restaurant-chip restaurant-chip--light">
                  ID #{restaurant?.id}
                </span>
              </div>

              <h1 className="display-5 fw-semibold mb-2 text-white">
                {restaurantName}
              </h1>
              <p className="restaurant-hero__lead mb-0">
                {description ||
                  `${restaurantName} is listed in the admin system${
                    cuisine ? ` under ${cuisine}` : ""
                  }. This page centralizes operational details, ownership, and service visibility in one place.`}
              </p>
            </div>

            <div className="restaurant-hero__aside">
              <div className="restaurant-glass-card">
                <div className="restaurant-hero__stat-grid">
                  <div>
                    <span className="restaurant-stat__label">Rating</span>
                    <strong>{formatMetric(rating, "/5")}</strong>
                  </div>
                  <div>
                    <span className="restaurant-stat__label">Orders</span>
                    <strong>{formatMetric(orders)}</strong>
                  </div>
                  <div>
                    <span className="restaurant-stat__label">Owner</span>
                    <strong>{owner || "Not assigned"}</strong>
                  </div>
                  <div>
                    <span className="restaurant-stat__label">Price range</span>
                    <strong>{priceRange || "Not set"}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-light w-100 mt-3"
                  onClick={() =>
                    navigate(`/restaurants/${restaurant?.id}/edit`)
                  }
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit restaurant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="restaurant-panel card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                <div>
                  <span className="restaurant-section-kicker">Overview</span>
                  <h2 className="h4 mb-1">Service snapshot</h2>
                </div>
                <span className="text-muted small">
                  Current operational summary for the selected restaurant
                </span>
              </div>

              <div className="row g-3">
                <div className="col-sm-6 col-lg-3">
                  <div className="restaurant-metric-card">
                    <span className="restaurant-metric-card__icon text-warning">
                      <i className="bi bi-star-fill"></i>
                    </span>
                    <span className="restaurant-metric-card__label">
                      Guest rating
                    </span>
                    <strong>{formatMetric(rating, "/5")}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="restaurant-metric-card">
                    <span className="restaurant-metric-card__icon text-primary">
                      <i className="bi bi-bag-check-fill"></i>
                    </span>
                    <span className="restaurant-metric-card__label">
                      Total orders
                    </span>
                    <strong>{formatMetric(orders)}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="restaurant-metric-card">
                    <span className="restaurant-metric-card__icon text-success">
                      <i className="bi bi-check2-circle"></i>
                    </span>
                    <span className="restaurant-metric-card__label">
                      Status
                    </span>
                    <strong>{isActive ? "Live" : "Paused"}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="restaurant-metric-card">
                    <span className="restaurant-metric-card__icon text-info">
                      <i className="bi bi-clock-history"></i>
                    </span>
                    <span className="restaurant-metric-card__label">
                      Delivery ETA
                    </span>
                    <strong>{deliveryTime || "Not shared"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="restaurant-panel card border-0 shadow-sm">
            <div className="card-body p-4">
              <span className="restaurant-section-kicker">Story</span>
              <h2 className="h4 mb-3">Brand and service context</h2>
              <p className="text-muted mb-4 restaurant-body-copy">
                {description ||
                  `${restaurantName} currently has limited descriptive content in the dataset. This view is ready to surface richer brand copy, policy notes, and operational guidance as the restaurant profile expands.`}
              </p>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="restaurant-info-block">
                    <span className="restaurant-info-block__label">
                      Cuisine focus
                    </span>
                    <strong>{cuisine || "Not categorized"}</strong>
                    <small>Primary market positioning visible to admins.</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="restaurant-info-block">
                    <span className="restaurant-info-block__label">
                      Minimum order
                    </span>
                    <strong>{formatMinimumOrder(minimumOrder)}</strong>
                    <small>
                      Displayed when platform order thresholds are configured.
                    </small>
                  </div>
                </div>
                <div className="col-12">
                  <div className="restaurant-info-block">
                    <span className="restaurant-info-block__label">
                      Operating hours
                    </span>
                    <strong>{openingHours}</strong>
                    <small>
                      Update this section once structured schedule data is
                      available.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="restaurant-panel card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                <div>
                  <span className="restaurant-section-kicker">Gallery</span>
                  <h2 className="h4 mb-1">Visual preview</h2>
                </div>
                {isUsingSampleGallery ? (
                  <span className="restaurant-chip restaurant-chip--outline">
                    Sample imagery
                  </span>
                ) : null}
              </div>

              <div className="restaurant-gallery">
                <figure className="restaurant-gallery__featured mb-0">
                  <img
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    className="restaurant-gallery__image"
                  />
                </figure>

                <div className="restaurant-gallery__grid">
                  {galleryImages.slice(1).map((image) => (
                    <figure
                      key={image.src}
                      className="restaurant-gallery__tile mb-0"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="restaurant-gallery__image"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="restaurant-panel card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <span className="restaurant-section-kicker">Contact</span>
              <h2 className="h4 mb-3">Ownership and reachability</h2>

              <div className="restaurant-detail-list">
                <div>
                  <span>Owner</span>
                  <strong>{owner || "Not assigned"}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{phone || "No phone on file"}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{email || "No email on file"}</strong>
                </div>
                <div>
                  <span>Address</span>
                  <strong>{address || "No address on file"}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="restaurant-panel card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <span className="restaurant-section-kicker">Signals</span>
              <h2 className="h4 mb-3">Visibility tags</h2>
              <div className="d-flex flex-wrap gap-2">
                {(featureTags.length > 0
                  ? featureTags
                  : [
                      cuisine || "Uncategorized",
                      isActive ? "Accepting orders" : "Not accepting orders",
                      rating ? "Rated listing" : "Unrated listing",
                    ]
                ).map((tag) => (
                  <span
                    key={tag}
                    className="restaurant-chip restaurant-chip--outline"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="restaurant-panel card border-0 shadow-sm">
            <div className="card-body p-4">
              <span className="restaurant-section-kicker">Admin notes</span>
              <h2 className="h4 mb-3">Recommended next actions</h2>
              <ul className="restaurant-action-list mb-0">
                <li>
                  Review missing profile fields before publishing this
                  restaurant more broadly.
                </li>
                <li>Confirm that ownership and contact details are current.</li>
                <li>
                  Use the edit flow to enrich the profile with description,
                  schedule, and pricing data.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => navigate("/restaurants")}
      >
        <i className="bi bi-arrow-left"></i>
        Back
      </button>
    </div>
  );
}
