package com.eddie.hungry_belly_backend.repository;

import com.eddie.hungry_belly_backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Query("SELECT c FROM CartItem c WHERE c.user.id = :userId")
    List<CartItem> findByUserId(@Param(value = "userId") Long userId);

    void deleteByUserId(Long userId);
}
