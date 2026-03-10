package com.eddie.hungry_belly_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "cart_items")
@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id")
    private Food food;

    private int quantity;



    public CartItem(AppUser user, Food food, int quantity) {
        this.user = user;
        this.food = food;
        this.quantity = quantity;
    }

    public CartItem(AppUser user, Food food) {
        this.user = user;
        this.food = food;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        CartItem cartItem = (CartItem) o;
        return Objects.equals(user.getId(), cartItem.user.getId()) && Objects.equals(food.getId(), cartItem.food.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, food);
    }
}
