package com.eddie.hungry_belly_backend.repository;

import com.eddie.hungry_belly_backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Query("SELECT c FROM CartItem c WHERE c.user.id = :userId")
    List<CartItem> findByUserId(@Param(value = "userId") Long userId);

    @Modifying
    void deleteByUserId(Long userId);

    @Query("DELETE FROM CartItem c WHERE c.user.id = :userId AND c.food.id = :foodId")
    @Modifying
    void removeCartItemByUserAndFood(@Param(value = "userId") Long userId, @Param(value = "foodId") Long foodId);
}
