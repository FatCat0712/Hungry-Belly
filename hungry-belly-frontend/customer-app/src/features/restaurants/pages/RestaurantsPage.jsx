import { useState, useEffect } from 'react'
import RestaurantCard from '../components/RestaurantCard.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import { restaurants, categories } from '../data/data.js'

function RestaurantsPage() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredRestaurants = restaurants
    .filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || 
        restaurant.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()))
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'deliveryTime') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
      if (sortBy === 'deliveryFee') return a.deliveryFee - b.deliveryFee
      return 0
    })

  return (
    <div className="py-5" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <div className="container">
        <h1 className="section-title mb-4">All Restaurants</h1>
        
        {/* Filters */}
        <div className="card p-4 mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-bold">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <label className="form-label fw-bold">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label fw-bold">Sort By</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rated</option>
                <option value="deliveryTime">Fastest Delivery</option>
                <option value="deliveryFee">Lowest Delivery Fee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-muted mb-4">
          Showing {filteredRestaurants.length} restaurants
        </p>

        {/* Restaurant Grid */}
        <div className="row g-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3">
                <LoadingSkeleton type="card" />
              </div>
            ))
          ) : (
            filteredRestaurants.map(restaurant => (
              <div key={restaurant.id} className="col-12 col-md-6 col-lg-3">
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredRestaurants.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-search"></i>
            <h4>No restaurants found</h4>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantsPage
