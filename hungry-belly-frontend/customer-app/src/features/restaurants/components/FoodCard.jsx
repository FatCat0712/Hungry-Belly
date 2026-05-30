function FoodCard({ item, onAddToCart }) {
  return (
    <div className="card food-card">
      <div className="row g-0">
        <div className="col-4">
          <img 
            src={item.image} 
            className="food-image w-100 h-100"
            alt={item.name}
          />
        </div>
        <div className="col-8">
          <div className="card-body">
            <h5 className="food-name">{item.name}</h5>
            <p className="food-description">{item.description}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="food-price">${item.price.toFixed(2)}</span>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onAddToCart(item)}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodCard
