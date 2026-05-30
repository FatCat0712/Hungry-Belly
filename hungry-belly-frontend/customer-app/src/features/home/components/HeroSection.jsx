import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/restaurants')
  }

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <h1 className="hero-title">
              Fast delivery for your 
              <span className="d-block" style={{ color: '#F26B5B' }}>favorite food</span>
            </h1>
            <p className="hero-subtitle">
              Order from the best local restaurants with easy, on-demand delivery.
              Fresh food delivered to your door in minutes.
            </p>
            
            <form onSubmit={handleSearch} className="search-box d-flex mt-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-0">
                  <i className="bi bi-geo-alt text-muted fs-5"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary ms-2">
                <i className="bi bi-search me-2"></i>
                Find Food
              </button>
            </form>
            
            <div className="d-flex align-items-center gap-4 mt-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-clock-fill text-warning me-2 fs-5"></i>
                <span className="text-muted">Fast Delivery</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-star-fill text-warning me-2 fs-5"></i>
                <span className="text-muted">Best Quality</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-shield-check-fill text-warning me-2 fs-5"></i>
                <span className="text-muted">Safe Payment</span>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=500&fit=crop"
              alt="Delicious Food"
              className="img-fluid rounded-4 shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
