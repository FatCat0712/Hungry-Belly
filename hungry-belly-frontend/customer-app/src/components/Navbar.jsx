import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

function Navbar({ cartCount }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src={assets.logo} alt="Hungry Belly" height="40" />
          <span className="fw-bold">Hungry Belly</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                <i className="bi bi-house-door me-1"></i>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/restaurants" className="nav-link">
                <i className="bi bi-shop me-1"></i>
                Restaurants
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/orders" className="nav-link">
                <i className="bi bi-receipt me-1"></i>
                Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                <i className="bi bi-envelope me-1"></i>
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link
              to="/cart"
              className="btn btn-outline-primary position-relative"
            >
              <i className="bi bi-cart3 me-1"></i>
              Cart
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="btn btn-outline-secondary">
              <i className="bi bi-person me-1"></i>
              Login
            </button>
            <button className="btn btn-primary">Register</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
