package com.eddie.hungry_belly_backend.restaurant.repository;

import com.eddie.hungry_belly_backend.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Query("SELECT r FROM Restaurant r WHERE " +
            "r.name LIKE %?1% OR " +
            "r.cuisine LIKE %?1% OR " +
            "r.description LIKE %?1% OR " +
            "r.owner LIKE %?1%" )
    Page<Restaurant> findRestaurantsByKeyword(String keyword, Pageable pageable);

    Restaurant findByPhone(String phone);
    Restaurant findByName(String name);

    @Query("UPDATE Restaurant r SET r.enabled = ?2 WHERE r.id = ?1")
    @Modifying
    void updateRestaurantStatus(Long restaurantId, boolean isActive);
}
