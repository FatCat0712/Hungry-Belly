package com.eddie.hungry_belly_backend.category.repository;

import com.eddie.hungry_belly_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
