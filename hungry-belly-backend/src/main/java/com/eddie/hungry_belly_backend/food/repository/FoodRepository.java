package com.eddie.hungry_belly_backend.food.repository;

import com.eddie.hungry_belly_backend.entity.food.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    @Query(
            value = """
                        SELECT f.id
                        FROM food_items f
                        LEFT JOIN restaurants r ON r.id = f.restaurant_id
                        WHERE f.is_deleted = false
                        AND (
                            LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR EXISTS(
                                SELECT 1
                                FROM food_item_categories fc
                                JOIN categories c ON c.id = fc.category_id
                                WHERE fc.food_id = f.id
                                AND LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            )
                        )
                """,
            countQuery = """
                        SELECT COUNT(*)
                        FROM food_items f
                        LEFT JOIN restaurants r ON r.id = f.restaurant_id
                        WHERE f.is_deleted = false
                        AND (
                            LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR EXISTS(
                                SELECT 1
                                FROM food_item_categories fc
                                JOIN categories c ON c.id = fc.category_id
                                WHERE fc.food_id = f.id
                                AND LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            )
                        )
                    """
            , nativeQuery = true
    )
    Page<Long> findIdFoodsWithKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT f.id FROM Food f WHERE f.isDeleted = false")
    Page<Long> findAllFoodIds(Pageable pageable);

    @Query("SELECT DISTINCT f FROM Food f LEFT JOIN FETCH f.categories c WHERE f.id IN (:ids)")
    List<Food> findByIdsIn(List<Long> ids);
}
