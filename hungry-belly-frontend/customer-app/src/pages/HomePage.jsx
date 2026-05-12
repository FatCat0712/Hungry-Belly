import HeroSection from "../components/HeroSection.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import { categories, restaurants } from "../data/data.js";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const featuredRestaurants = restaurants.filter((r) => r.featured);

  const handleCategoryClick = (category) => {
    navigate("/restaurants");
  };

  return (
    <>
      <HeroSection />

      {/* Food Categories Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">Explore by Category</h2>
          <p className="section-subtitle text-center">
            Choose from a variety of cuisines and find your favorite food
          </p>

          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-6 col-md-4 col-lg-2">
                <CategoryCard
                  category={category}
                  onClick={handleCategoryClick}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="py-5" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title mb-0">Popular Restaurants</h2>
              <p className="section-subtitle mb-0">
                Top-rated restaurants near you
              </p>
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/restaurants")}
            >
              View All
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>

          <div className="row g-4">
            {featuredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="col-12 col-md-6 col-lg-3">
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <p className="section-subtitle text-center">
            Get your food delivered in 3 simple steps
          </p>

          <div className="row g-4 mt-4">
            <div className="col-md-4 text-center">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #FFF5F3 0%, #FFF9E6 100%)",
                }}
              >
                <i
                  className="bi bi-geo-alt-fill fs-2"
                  style={{ color: "#F26B5B" }}
                ></i>
              </div>
              <h5 className="fw-bold">Choose Location</h5>
              <p className="text-muted">
                Enter your delivery address to find restaurants near you
              </p>
            </div>

            <div className="col-md-4 text-center">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #FFF5F3 0%, #FFF9E6 100%)",
                }}
              >
                <i className="bi bi-shop fs-2" style={{ color: "#F5C85C" }}></i>
              </div>
              <h5 className="fw-bold">Select Restaurant</h5>
              <p className="text-muted">
                Browse menus from hundreds of local restaurants
              </p>
            </div>

            <div className="col-md-4 text-center">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #FFF5F3 0%, #FFF9E6 100%)",
                }}
              >
                <i
                  className="bi bi-bag-check-fill fs-2"
                  style={{ color: "#F26B5B" }}
                ></i>
              </div>
              <h5 className="fw-bold">Enjoy Your Food</h5>
              <p className="text-muted">
                Get your order delivered fast right to your door
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #F26B5B 0%, #F5C85C 100%)",
          color: "white",
        }}
      >
        <div className="container text-center">
          <h2 className="mb-3 fw-bold">Ready to Order?</h2>
          <p className="mb-4 fs-5">
            Download our app and get 20% off your first order!
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-light btn-lg">
              <i className="bi bi-apple me-2"></i>
              App Store
            </button>
            <button className="btn btn-light btn-lg">
              <i className="bi bi-google-play me-2"></i>
              Play Store
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
