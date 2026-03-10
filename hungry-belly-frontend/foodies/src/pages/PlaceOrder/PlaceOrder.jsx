import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtil";

const PlaceOrder = () => {
  const { foodList, quantities } = useContext(StoreContext);

  // cartItems
  const cartItems = foodList.filter((food) => quantities[food.id] > 0);

  // calculating
  const { subTotal, shippingFee, tax, total } = calculateCartTotals(
    cartItems,
    quantities,
  );

  

  return (
    <div className="container mt-4">
      <div className="py-3 text-center">
        <img
          src={assets.logo}
          alt=""
          className="d-block mx-auto"
          width="98"
          height="98"
        />
      </div>
      <div className="row g-5">
        <div className="col-md-7 col-lg-8">
          <h4 className="mb-3">Billing address</h4>
          <form className="needs-validation" novalidate>
            <div className="row g-3 mb-2">
              <div className="col-sm-6">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="John"
                  value=""
                  required
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Doe"
                  value=""
                  required
                />
              </div>
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">@</span>
                </div>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="email"
                  required
                />
              </div>
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="phone">Phone</label>
              <input
                type="number"
                className="form-control"
                id="phone"
                placeholder="987654321"
              />
            </div>

            <div className="col-12 mb-2">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="1234 Main St"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-5 mb-3">
                <label htmlFor="country">Country</label>
                <select
                  className="form-select d-block w-100"
                  id="country"
                  required
                >
                  <option value="">Choose...</option>
                  <option>India</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="state">State</label>
                <select
                  className="form-select d-block w-100"
                  id="state"
                  required
                >
                  <option value="">Choose...</option>
                  <option>Karnataka</option>
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="zip">Zip</label>
                <input
                  type="number"
                  className="form-control"
                  id="zip"
                  placeholder="98745"
                  required
                />
              </div>
            </div>

            <hr className="mb-4" />
            <button
              className="w-100 btn btn-primary btn-lg"
              type="submit"
              disabled={cartItems.length === 0}
            >
              Continue to checkout
            </button>
          </form>
        </div>
        <div className="col-md-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Your cart</span>
            <span className="badge bg-primary rounded-pill">
              {Object.keys(quantities).length}
            </span>
          </h4>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                  <h6 className="my-0">{item.name}</h6>
                  <small className="text-muted">
                    Qty: {quantities[item.id]}
                  </small>
                </div>
                <span className="text-muted">
                  ${item.price * quantities[item.id]}
                </span>
              </li>
            ))}

            <li className="list-group-item d-flex justify-content-between">
              <div>
                <span>Shipping</span>
              </div>
              <span className="text-body-secondary">
                ${subTotal === 0 ? 0.0 : shippingFee.toFixed(2)}
              </span>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <div>
                <span>Tax (10%)</span>
              </div>
              <span className="text-body-secondary">
                ${subTotal === 0 ? 0.0 : tax.toFixed(2)}
              </span>
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <span>Total (USD)</span>
              <strong>${total.toFixed(2)}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
