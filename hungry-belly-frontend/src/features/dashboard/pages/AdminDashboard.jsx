export default function AdminDashboard() {
  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <small className="text-uppercase text-secondary">Admin</small>
          <h1 className="h3 mb-0">Dashboard</h1>
          <p className="text-secondary mb-0">
            Monitor orders, users, and restaurants in one place.
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-plus-lg" /> Add Quick Item
        </button>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Total Orders</p>
                  <h5>1,248</h5>
                </div>
                <span className="badge bg-success py-2 px-3">
                  <i className="bi bi-cart-check" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Active Users</p>
                  <h5>3,902</h5>
                </div>
                <span className="badge bg-primary py-2 px-3">
                  <i className="bi bi-people" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Open Restaurants</p>
                  <h5>144</h5>
                </div>
                <span className="badge bg-warning py-2 px-3 text-dark">
                  <i className="bi bi-shop" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Revenue</p>
                  <h5>$73,206</h5>
                </div>
                <span className="badge bg-info py-2 px-3 text-dark">
                  <i className="bi bi-currency-dollar" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Recent Orders</h6>
                <span className="text-secondary">Updated 2m ago</span>
              </div>
              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#A19283</td>
                      <td>Martin</td>
                      <td>
                        <span className="badge bg-success">Delivered</span>
                      </td>
                      <td>$35.10</td>
                    </tr>
                    <tr>
                      <td>#A19284</td>
                      <td>Ava</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          Preparing
                        </span>
                      </td>
                      <td>$18.90</td>
                    </tr>
                    <tr>
                      <td>#A19285</td>
                      <td>Priya</td>
                      <td>
                        <span className="badge bg-danger">Cancelled</span>
                      </td>
                      <td>$0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Quick Actions</h6>
                <button className="btn btn-sm btn-outline-secondary">
                  Manage
                </button>
              </div>
              <div className="list-group">
                <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Review new restaurant</strong>
                    <div className="text-secondary small">
                      25 pending reviews
                    </div>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </button>
                <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Approve user requests</strong>
                    <div className="text-secondary small">4 new users</div>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </button>
                <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Set promotions</strong>
                    <div className="text-secondary small">
                      2 active campaigns
                    </div>
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
