package com.eddie.hungry_belly_backend.controller;

import com.eddie.hungry_belly_backend.io.CartRequest;
import com.eddie.hungry_belly_backend.io.CartResponse;
import com.eddie.hungry_belly_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add")
    public CartResponse addToCart(@RequestBody CartRequest request) {
            Long foodId = request.getFoodId();
            if(foodId == null) {
               throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Food not found");
            }
            return cartService.addToCart(request);
    }

    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }


    @DeleteMapping("/clear")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        cartService.clearCart();
    }

    @DeleteMapping("/remove")
    public CartResponse removeFromCart(@RequestBody CartRequest request) {
        Long foodId = request.getFoodId();
        if(foodId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Food not found");
        }
        return cartService.removeFromCart(request);
    }
}
