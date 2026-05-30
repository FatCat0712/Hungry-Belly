import { Link } from "react-router-dom";
import CartItem from "../components/CartItem.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";

function CartPage({ cartItems, updateQuantity, clearCart }) {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="bi-cart-x"
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet"
          actionText="Browse Restaurants"
          actionLink="/restaurants"
        />
      </div>
    );
  }

  return (
    <div
      className="py-5"
      style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="section-title mb-0">Your Cart</h1>
          <button className="btn btn-outline-danger" onClick={clearCart}>
            <i className="bi bi-trash me-2"></i>
            Clear Cart
          </button>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-bag me-2"></i>
                Order Items ({cartItems.length})
              </h5>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>

            {/* Delivery Address */}
            <div className="card p-4 mt-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-geo-alt me-2"></i>
                Delivery Address
              </h5>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-house"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your delivery address"
                />
                <button className="btn btn-outline-primary">
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-4 mt-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-credit-card me-2"></i>
                Payment Method
              </h5>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    id="card"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="card">
                    <i className="bi bi-credit-card me-1"></i>
                    Credit Card
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    id="cash"
                  />
                  <label className="form-check-label" htmlFor="cash">
                    <i className="bi bi-cash me-1"></i>
                    Cash on Delivery
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    id="paypal"
                  />
                  <label className="form-check-label" htmlFor="paypal">
                    <i className="bi bi-paypal me-1"></i>
                    PayPal
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card p-4 sticky-top" style={{ top: "100px" }}>
              <h5 className="fw-bold mb-4">
                <i className="bi bi-receipt me-2"></i>
                Order Summary
              </h5>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span style={{ color: "#F26B5B" }}>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-4">
                <label className="form-label fw-bold">Promo Code</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter code"
                  />
                  <button className="btn btn-outline-primary">Apply</button>
                </div>
              </div>

              <button className="btn btn-primary w-100 mt-4 py-3">
                <i className="bi bi-lock me-2"></i>
                Place Order - ${total.toFixed(2)}
              </button>

              <p className="text-muted text-center mt-3 small">
                <i className="bi bi-shield-check me-1"></i>
                Secure checkout. Your data is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
