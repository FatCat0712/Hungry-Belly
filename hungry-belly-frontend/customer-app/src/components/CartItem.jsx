function CartItem({ item, onUpdateQuantity }) {
  return (
    <div className="cart-item">
      <img 
        src={item.image} 
        alt={item.name}
        className="item-image"
      />
      
      <div className="flex-grow-1">
        <h6 className="mb-1 fw-bold">{item.name}</h6>
        <small className="text-muted">{item.restaurantName}</small>
        <div className="mt-2 fw-bold" style={{ color: '#F26B5B' }}>
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
      
      <div className="quantity-control">
        <button 
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <i className="bi bi-dash"></i>
        </button>
        <span className="fw-bold">{item.quantity}</span>
        <button 
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>
    </div>
  )
}

export default CartItem
