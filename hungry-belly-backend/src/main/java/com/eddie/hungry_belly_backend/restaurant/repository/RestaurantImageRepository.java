package com.eddie.hungry_belly_backend.restaurant.repository;

import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantImage;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantImageRepository extends CrudRepository<RestaurantImage, Long> {
    @Query("SELECT r.imageUrl FROM RestaurantImage r")
    List<String> findAllPaths();
}
