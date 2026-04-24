package com.eddie.hungry_belly_backend.category.repository;

import com.eddie.hungry_belly_backend.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);

    @Query("SELECT c FROM Category c WHERE c.parent.id IS NULL")
    List<Category> findRootCategories();

    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% OR c.alias LIKE %:keyword%")
    Page<Category> findCategoriesWithKeyword(String keyword, Pageable pageable);





}
