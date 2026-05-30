import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./features/home/pages/HomePage";
import RestaurantsPage from "./features/restaurants/pages/RestaurantsPage";
import RestaurantDetailPage from "./features/restaurants/pages/RestaurantDetailPage";
import CartPage from "./features/cart/pages/CartPage";
import OrdersPage from "./features/orders/pages/OrdersPage";
import ContactPage from "./features/contact/pages/ContactPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import EmailVerificationPage from "./features/auth/pages/EmailVerificationPage";
import HomeLayout from "./shared/layouts/HomeLayout";

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
      <Routes>
        <Route path="/" element={<HomeLayout />}>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
