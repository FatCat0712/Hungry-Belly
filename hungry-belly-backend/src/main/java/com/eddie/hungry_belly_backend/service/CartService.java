package com.eddie.hungry_belly_backend.service;

import com.eddie.hungry_belly_backend.io.CartRequest;
import com.eddie.hungry_belly_backend.io.CartResponse;

public interface CartService {
    CartResponse addToCart(CartRequest request);
    CartResponse getCart();
    void clearCart();
    CartResponse removeFromCart(CartRequest cartRequest);

}
