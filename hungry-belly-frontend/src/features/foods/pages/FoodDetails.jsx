import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import "../../../shared/styles/FoodDetails.css";

const mockFood = {
  id: 204,
  name: "Volcano Chicken Burger Combo",
  description:
    "Crispy spicy chicken burger, seasoned wedges, and house-made lime soda. Built for 30-minute delivery windows.",
  restaurant_id: 12,
  category_id: 4,
  price: 11.9,
  is_available: true,
  is_deleted: false,
  image_url:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80",
  stock_quantity: 37,
  cuisine: "American Fast Casual",
  prep_time: "15-20 min",
  sold_today: 84,
  avg_rating: 4.6,
  rating_count: 229,
  last_sync: "2026-04-24 10:18",
};

const FoodDetails = () => {
  const { id } = useParams();
  const currentFoodId = id || String(mockFood.id);
  const stockStatus = useMemo(() => {
    if (mockFood.stock_quantity === 0) return "Out of stock";
    if (mockFood.stock_quantity <= 10) return "Low stock";
    return "Healthy stock";
  }, []);
  const visibilityStatus = mockFood.is_deleted ? "Archived" : "Live";

  return (
    <div className="food-details-page">
      <section className="food-hero food-delivery-hero">
        <div className="food-glow food-glow-left" />
        <div className="food-glow food-glow-right" />

        <div className="food-layout">
          <div className="food-gallery-card">
            <div className="food-main-image-wrap">
              <img
                src={mockFood.image_url}
                alt={mockFood.name}
                className="food-main-image"
              />
              <span className="food-image-tag">Delivery Hero Image</span>
            </div>

            <div className="food-image-meta">
              <p className="mb-1">
                <strong>image_url:</strong>
              </p>
              <code className="food-inline-code">{mockFood.image_url}</code>
            </div>
          </div>

          <div className="food-info-card">
            <div className="food-top-head">
              <p className="food-kicker">Delivery Admin Food Details</p>
              <span className="food-id">id: {currentFoodId}</span>
            </div>
            <h1>{mockFood.name}</h1>
            <p className="food-tagline">{mockFood.description}</p>

            <div className="food-badges">
              <span
                className={`food-badge-pill ${mockFood.is_available ? "is-positive" : "is-warning"}`}
              >
                {mockFood.is_available ? "Available" : "Unavailable"}
              </span>
              <span
                className={`food-badge-pill ${mockFood.is_deleted ? "is-warning" : "is-positive"}`}
              >
                {visibilityStatus}
              </span>
              <span className="food-badge-pill">{stockStatus}</span>
            </div>

            <div className="food-meta-grid">
              <div>
                <span>restaurant_id</span>
                <strong>{mockFood.restaurant_id}</strong>
              </div>
              <div>
                <span>category_id</span>
                <strong>{mockFood.category_id}</strong>
              </div>
              <div>
                <span>cuisine</span>
                <strong>{mockFood.cuisine}</strong>
              </div>
              <div>
                <span>prep_time</span>
                <strong>{mockFood.prep_time}</strong>
              </div>
              <div>
                <span>avg_rating</span>
                <strong>
                  {mockFood.avg_rating} ({mockFood.rating_count})
                </strong>
              </div>
              <div>
                <span>last_sync</span>
                <strong>{mockFood.last_sync}</strong>
              </div>
              <div>
                <span>is_available</span>
                <strong>{String(mockFood.is_available)}</strong>
              </div>
              <div>
                <span>is_deleted</span>
                <strong>{String(mockFood.is_deleted)}</strong>
              </div>
              <div>
                <span>stock_quantity</span>
                <strong>{mockFood.stock_quantity}</strong>
              </div>
            </div>

            <div className="food-stats-row">
              <div className="food-price-block">
                <small>price</small>
                <strong>${mockFood.price.toFixed(2)}</strong>
              </div>
              <div className="food-price-block">
                <small>sold_today</small>
                <strong>{mockFood.sold_today}</strong>
              </div>
              <div className="food-price-block">
                <small>Est. Revenue Today</small>
                <strong>
                  ${(mockFood.price * mockFood.sold_today).toFixed(2)}
                </strong>
              </div>
              <div className="food-price-block">
                <small>Stock Health</small>
                <strong>{stockStatus}</strong>
              </div>
            </div>

            <div className="food-admin-actions">
              <button type="button" className="food-add-btn">
                <i className="bi bi-pencil-square" /> Edit Item
              </button>
              <button type="button" className="food-secondary-btn">
                <i className="bi bi-toggle-on" /> Toggle Availability
              </button>
              <Link to="/categories" className="food-link-btn">
                <i className="bi bi-grid" /> View Category
              </Link>
              <Link to="/restaurants" className="food-link-btn">
                <i className="bi bi-house" /> View Restaurant
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="food-lower-grid">
        <article className="food-panel food-panel-wide">
          <h2>Schema Mapping (food_items)</h2>
          <div className="food-schema-grid">
            <div className="food-schema-row">
              <span>id BIGINT</span>
              <strong>{mockFood.id}</strong>
            </div>
            <div className="food-schema-row">
              <span>name VARCHAR</span>
              <strong>{mockFood.name}</strong>
            </div>
            <div className="food-schema-row">
              <span>description TEXT</span>
              <strong>{mockFood.description}</strong>
            </div>
            <div className="food-schema-row">
              <span>restaurant_id BIGINT</span>
              <strong>{mockFood.restaurant_id}</strong>
            </div>
            <div className="food-schema-row">
              <span>price DECIMAL</span>
              <strong>{mockFood.price.toFixed(2)}</strong>
            </div>
            <div className="food-schema-row">
              <span>is_available BOOLEAN</span>
              <strong>{String(mockFood.is_available)}</strong>
            </div>
            <div className="food-schema-row">
              <span>category_id INT</span>
              <strong>{mockFood.category_id}</strong>
            </div>
            <div className="food-schema-row">
              <span>image_url VARCHAR</span>
              <strong className="food-ellipsis">{mockFood.image_url}</strong>
            </div>
            <div className="food-schema-row">
              <span>is_deleted BOOLEAN</span>
              <strong>{String(mockFood.is_deleted)}</strong>
            </div>
            <div className="food-schema-row">
              <span>stock_quantity INT</span>
              <strong>{mockFood.stock_quantity}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default FoodDetails;
