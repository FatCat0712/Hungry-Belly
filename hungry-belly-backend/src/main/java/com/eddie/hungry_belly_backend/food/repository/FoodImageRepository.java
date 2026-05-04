package com.eddie.hungry_belly_backend.food.repository;

import com.eddie.hungry_belly_backend.entity.food.FoodImage;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodImageRepository extends CrudRepository<FoodImage, Long> {
    @Query("SELECT f.imageUrl FROM FoodImage f")
    List<String> findAllPaths();
}
