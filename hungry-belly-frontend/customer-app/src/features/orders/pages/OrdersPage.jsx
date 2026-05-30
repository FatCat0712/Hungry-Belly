import EmptyState from "../../../shared/components/EmptyState.jsx";

function OrdersPage() {
  // Sample orders data - in a real app this would come from an API
  const orders = [
    {
      id: "#ORD-12345",
      restaurant: "Pizza Paradise",
      items: ["Margherita Pizza", "Garlic Bread"],
      total: 20.98,
      status: "Delivered",
      date: "2024-01-15",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
    },
    {
      id: "#ORD-12344",
      restaurant: "Burger Barn",
      items: ["Classic Cheeseburger", "Crispy Fries"],
      total: 17.98,
      status: "In Progress",
      date: "2024-01-15",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
    },
    {
      id: "#ORD-12343",
      restaurant: "Sakura Sushi",
      items: ["Rainbow Roll", "Miso Soup"],
      total: 22.98,
      status: "Pending",
      date: "2024-01-14",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop",
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-success",
      "In Progress": "bg-warning text-dark",
      Pending: "bg-secondary",
      Cancelled: "bg-danger",
    };
    return styles[status] || "bg-secondary";
  };

  if (orders.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="bi-receipt"
          title="No orders yet"
          description="You haven't placed any orders yet. Start exploring restaurants!"
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
        <h1 className="section-title mb-4">My Orders</h1>

        <div className="row g-4">
          {orders.map((order) => (
            <div key={order.id} className="col-12">
              <div className="card p-4">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <img
                      src={order.image}
                      alt={order.restaurant}
                      className="rounded"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="col">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1">{order.restaurant}</h5>
                        <p className="text-muted mb-1 small">
                          {order.items.join(", ")}
                        </p>
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          {order.date}
                          <span className="mx-2">•</span>
                          {order.id}
                        </small>
                      </div>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="col-auto text-end">
                    <div className="fw-bold fs-5" style={{ color: "#F26B5B" }}>
                      ${order.total.toFixed(2)}
                    </div>
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-arrow-repeat me-1"></i>
                        Reorder
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-eye me-1"></i>
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
