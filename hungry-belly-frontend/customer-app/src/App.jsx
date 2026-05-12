import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ContactPage from "./pages/ContactPage";
import Footer from "./components/Footer";

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item, restaurantId, restaurantName) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        { ...item, quantity: 1, restaurantId, restaurantName },
      ]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar cartCount={cartCount} />
        <main className="grow">
          <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route
                      path="/restaurant/:id"
                      element={<RestaurantDetailPage addToCart={addToCart} />}
                    />
                    <Route
                      path="/cart"
                      element={
                        <CartPage
                          cartItems={cartItems}
                          updateQuantity={updateQuantity}
                          clearCart={clearCart}
                        />
                      }
                    />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
