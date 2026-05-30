import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FoodCard from '../components/FoodCard.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import { restaurants, menuItems } from '../data/data.js'

function RestaurantDetailPage({ addToCart }) {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const restaurant = restaurants.find(r => r.id === parseInt(id))
  const menu = menuItems[id] || []

  if (!restaurant) {
    return (
      <div className="container py-5 text-center">
        <h2>Restaurant not found</h2>
      </div>
    )
  }

  const menuCategories = ['All', ...new Set(menu.map(item => item.category))]
  
  const filteredMenu = activeCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === activeCategory)

  const handleAddToCart = (item) => {
    addToCart(item, restaurant.id, restaurant.name)
  }

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Banner */}
      <img 
        src={restaurant.image}
        alt={restaurant.name}
        className="restaurant-banner"
      />

      <div className="container" style={{ marginTop: '-60px' }}>
        {/* Restaurant Info Card */}
        <div className="restaurant-info-card">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="fw-bold mb-2">{restaurant.name}</h1>
              <div className="d-flex flex-wrap gap-3 text-muted mb-3">
                <span>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  {restaurant.rating} rating
                </span>
                <span>
                  <i className="bi bi-clock me-1"></i>
                  {restaurant.deliveryTime} min
                </span>
                <span>
                  <i className="bi bi-bicycle me-1"></i>
                  ${restaurant.deliveryFee.toFixed(2)} delivery
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {restaurant.categories.map((cat, index) => (
                  <span key={index} className="tag">{cat}</span>
                ))}
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button className="btn btn-outline-primary me-2">
                <i className="bi bi-heart me-1"></i>
                Save
              </button>
              <button className="btn btn-outline-primary">
                <i className="bi bi-share me-1"></i>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="py-4">
          <h2 className="section-title mb-4">Menu</h2>
          
          {/* Category Tabs */}
          <ul className="nav nav-pills menu-tabs mb-4">
            {menuCategories.map(category => (
              <li key={category} className="nav-item">
                <button
                  className={`nav-link ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>

          {/* Menu Items */}
          <div className="row">
            <div className="col-lg-8">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="mb-3">
                    <LoadingSkeleton type="food" />
                  </div>
                ))
              ) : filteredMenu.length > 0 ? (
                filteredMenu.map(item => (
                  <FoodCard 
                    key={item.id} 
                    item={item} 
                    onAddToCart={handleAddToCart}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <i className="bi bi-basket"></i>
                  <h4>No items in this category</h4>
                  <p>Check out other categories</p>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="col-lg-4">
              <div className="card p-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Restaurant Info
                </h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-clock text-muted me-2"></i>
                    Open: 10:00 AM - 10:00 PM
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-geo-alt text-muted me-2"></i>
                    123 Main Street, City
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-telephone text-muted me-2"></i>
                    +1 (555) 123-4567
                  </li>
                  <li>
                    <i className="bi bi-credit-card text-muted me-2"></i>
                    Cash, Card, Online Payment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetailPage
