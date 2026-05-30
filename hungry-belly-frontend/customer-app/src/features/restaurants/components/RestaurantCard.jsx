import { useState } from 'react'
import { Link } from 'react-router-dom'

function RestaurantCard({ restaurant }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="card restaurant-card h-100">
      <div className="position-relative">
        <img 
          src={restaurant.image} 
          className="card-img-top" 
          alt={restaurant.name}
        />
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
      </div>
      
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 fw-bold">{restaurant.name}</h5>
          <span className="rating">
            <i className="bi bi-star-fill"></i>
            {restaurant.rating}
          </span>
        </div>
        
        <div className="delivery-info mb-3">
          <i className="bi bi-clock me-1"></i>
          {restaurant.deliveryTime} min
          <span className="mx-2">•</span>
          <i className="bi bi-bicycle me-1"></i>
          ${restaurant.deliveryFee.toFixed(2)} delivery
        </div>
        
        <div className="d-flex flex-wrap gap-2 mb-3">
          {restaurant.categories.map((cat, index) => (
            <span key={index} className="tag">{cat}</span>
          ))}
        </div>
        
        <Link 
          to={`/restaurant/${restaurant.id}`} 
          className="btn btn-primary w-100"
        >
          <i className="bi bi-bag me-2"></i>
          Order Now
        </Link>
      </div>
    </div>
  )
}

export default RestaurantCard
