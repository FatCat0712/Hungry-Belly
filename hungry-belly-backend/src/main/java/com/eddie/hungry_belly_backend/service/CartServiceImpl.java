package com.eddie.hungry_belly_backend.service;

import com.eddie.hungry_belly_backend.entity.AppUser;
import com.eddie.hungry_belly_backend.entity.CartItem;
import com.eddie.hungry_belly_backend.entity.Food;
import com.eddie.hungry_belly_backend.io.CartRequest;
import com.eddie.hungry_belly_backend.io.CartResponse;
import com.eddie.hungry_belly_backend.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService{
    private final CartItemRepository cartItemRepository;
    private final FoodService foodService;
    private final UserService userService;


    @Override
    public CartResponse addToCart(CartRequest request) {
        AppUser loggedInUser = userService.findByUserId();
        List<CartItem> cartItems =  cartItemRepository.findByUserId(loggedInUser.getId());
        Food food = foodService.readFoodEntity(request.getFoodId());

        CartItem newCartItem = new CartItem(loggedInUser, food, 1);
        if(cartItems.contains(newCartItem)) {
           newCartItem = cartItems.get(cartItems.indexOf(newCartItem));
           newCartItem.setQuantity(newCartItem.getQuantity() + 1);
        }
        else {
            cartItems.add(newCartItem);
        }
        cartItemRepository.save(newCartItem);

        return convertToResponse(loggedInUser.getId(), food.getId(), cartItems);

    }

    private CartResponse convertToResponse(Long userId, Long foodId,  List<CartItem> items) {
        Map<Long, Integer> cartItems = new HashMap<>();

        items.forEach(item -> cartItems.put(item.getFood().getId(), item.getQuantity()));

        return CartResponse.builder()
                .userId(userId)
                .foodId(foodId)
                .items(cartItems)
                .build();
    }


}
