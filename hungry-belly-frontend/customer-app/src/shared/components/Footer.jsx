import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src={assets.logo} alt="Hungry Belly" height="40" />
              <h5 className="mb-0">Hungry Belly</h5>
            </div>
            <p className="text-white-50">
              Your favorite food, delivered fast. Order from the best
              restaurants in your area and enjoy delicious meals at your
              doorstep.
            </p>
            <div className="social-icons">
              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/restaurants">Restaurants</Link>
              </li>
              <li className="mb-2">
                <Link to="/orders">My Orders</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#">Help Center</a>
              </li>
              <li className="mb-2">
                <a href="#">FAQs</a>
              </li>
              <li className="mb-2">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h5>Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 Food Street, City Center
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +1 (555) 123-4567
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                support@hungrybelly.com
              </li>
              <li className="mb-2">
                <i className="bi bi-clock me-2"></i>
                24/7 Customer Support
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-white-50">
              © 2024 Hungry Belly. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <img
              src="https://img.shields.io/badge/Payment-Visa%20%7C%20Mastercard%20%7C%20PayPal-blue?style=flat-square"
              alt="Payment Methods"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
