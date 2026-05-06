package com.eddie.hungry_belly_backend.restaurantuser.repository;

import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantRole;
import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantUser;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantUserRepository extends JpaRepository<RestaurantUser, Long> {
    boolean existsByRestaurantIdAndUserId(Long restaurantId, Long userId);
    boolean existsByRestaurantIdAndUserIdAndRole(
            Long restaurantId,
            Long userId,
            RestaurantRole role
    );
    Optional<RestaurantUser> findByRestaurantIdAndUserId(Long restaurantId, Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT ru FROM RestaurantUser ru WHERE ru.restaurant.id = :restaurantId AND ru.role = com.eddie.hungry_belly_backend.entity.restaurant.RestaurantRole.OWNER")
    Optional<RestaurantUser> findOwnerByRestaurantIdForUpdate(@Param("restaurantId") Long restaurantId);

    @Query("SELECT ru FROM RestaurantUser ru JOIN FETCH ru.user u WHERE ru.restaurant.id = :restaurantId ORDER BY ru.role, u.firstName, u.lastName")
    List<RestaurantUser> findAllByRestaurantIdWithUser(@Param("restaurantId") Long restaurantId);

    @Query("SELECT ru FROM RestaurantUser ru JOIN FETCH ru.restaurant r WHERE ru.user.id = :userId ORDER BY r.name")
    List<RestaurantUser> findAllByUserIdWithRestaurant(@Param("userId") Long userId);

    @Query("""
            SELECT ru
            FROM RestaurantUser ru
            JOIN FETCH ru.restaurant r
            JOIN FETCH ru.user u
            WHERE u.id IN :userIds
            """)
    List<RestaurantUser> findByUserIdsWithRestaurant(@Param("userIds") List<Long> userIds);

}
