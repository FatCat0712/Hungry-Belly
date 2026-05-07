package com.eddie.hungry_belly_backend.restaurant.repository;

import com.eddie.hungry_belly_backend.entity.restaurant.Restaurant;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Query("SELECT r.id FROM Restaurant r WHERE " +
            "r.name LIKE %?1% OR " +
            "r.cuisine LIKE %?1% OR " +
            "r.description LIKE %?1% ")
    Page<Long> findRestaurantIdsByKeyword(String keyword, Pageable pageable);

    @Query("SELECT r.id FROM Restaurant r")
    Page<Long> findAllRestaurantIds(Pageable pageable);

    @Query(value = """
    SELECT DISTINCT NEW com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantSummaryResponse(
            r.id, 
            r.name, 
            r.cuisine,
            ri.imageUrl,
            r.rating, 
            r.orders,
            CONCAT(ru.user.firstName,' ', ru.user.lastName), 
            r.enabled
        )
    FROM Restaurant r
    LEFT JOIN r.images ri ON ri.isPrimary = true
    LEFT JOIN r.restaurantUsers ru ON r.id = ru.restaurant.id
    WHERE r.id IN :ids AND ru.role = com.eddie.hungry_belly_backend.entity.restaurant.RestaurantRole.OWNER
    """)
    List<RestaurantSummaryResponse>findAllWithCoverImageByIds(@Param("ids") List<Long> ids);

    Restaurant findByPhone(String phone);
    Restaurant findByName(String name);

    @Query("UPDATE Restaurant r SET r.enabled = ?2 WHERE r.id = ?1")
    @Modifying
    void updateRestaurantStatus(Long restaurantId, boolean isActive);


}
