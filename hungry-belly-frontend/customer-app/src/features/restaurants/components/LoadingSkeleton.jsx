function LoadingSkeleton({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="card h-100">
        <div className="skeleton" style={{ height: '180px' }}></div>
        <div className="card-body">
          <div className="skeleton mb-3" style={{ height: '24px', width: '70%' }}></div>
          <div className="skeleton mb-2" style={{ height: '16px', width: '50%' }}></div>
          <div className="skeleton mb-3" style={{ height: '16px', width: '40%' }}></div>
          <div className="skeleton" style={{ height: '40px' }}></div>
        </div>
      </div>
    )
  }

  if (type === 'food') {
    return (
      <div className="card food-card">
        <div className="row g-0">
          <div className="col-4">
            <div className="skeleton h-100" style={{ minHeight: '120px' }}></div>
          </div>
          <div className="col-8">
            <div className="card-body">
              <div className="skeleton mb-2" style={{ height: '24px', width: '60%' }}></div>
              <div className="skeleton mb-2" style={{ height: '16px' }}></div>
              <div className="skeleton" style={{ height: '16px', width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <div className="skeleton" style={{ height: '100px' }}></div>
}

export default LoadingSkeleton
