package com.eddie.hungry_belly_backend.repository;

import com.eddie.hungry_belly_backend.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
}
