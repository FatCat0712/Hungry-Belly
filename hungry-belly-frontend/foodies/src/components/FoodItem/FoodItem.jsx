import React from "react";

const FoodItem = ({ food }) => {
  return (
    <div
      key={food.id}
      className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
    >
      <div className="card" style={{ maxWidth: "320px" }}>
        <img
          src={food.imageUrl}
          alt="Product Image"
          className="card-img-top"
          height={300}
          width={60}
        />
        <div className="card-body">
          <h5 className="card-title">{food.name}</h5>
          <p className="card-text">{food.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">${food.price.toFixed(2)}</span>
            <div>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-half text-warning"></i>
              <small className="text-muted">(4.5)</small>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between bg-light">
          <button className="btn btn-primary btn-sm">View Food</button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
