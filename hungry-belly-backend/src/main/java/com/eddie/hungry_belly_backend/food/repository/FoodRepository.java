package com.eddie.hungry_belly_backend.food.repository;

import com.eddie.hungry_belly_backend.entity.food.Food;
import com.eddie.hungry_belly_backend.food.dto.projection.FoodCategoryProjection;
import com.eddie.hungry_belly_backend.food.dto.projection.FoodSummaryProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    @Query(
            value = """
                            SELECT f.id
                            FROM food_items f
                            LEFT JOIN restaurants r 
                             ON r.id = f.restaurant_id
                            WHERE (
                                LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
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
                        LEFT JOIN restaurants r 
                        ON r.id = f.restaurant_id
                        WHERE (
                            LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
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

    @Query("SELECT f.id FROM Food f")
    Page<Long> findAllFoodIds(Pageable pageable);

    @Query("""
            SELECT f FROM Food f
            WHERE f.restaurant.id = :restaurantId
            AND LOWER(TRIM(f.name)) = :normalizedName
            """)
    Optional<Food> findActiveByNormalizedName(@Param("restaurantId") Long restaurantId,
                                              @Param("normalizedName") String normalizedName);

    @Query("""
            SELECT 
                f.id AS id,
                f.name AS name,
                f.price AS price,
                f.isAvailable AS available,
                r.name AS restaurantName,
                fi.imageUrl AS imagePath
            FROM Food f
            JOIN f.restaurant r
            LEFT JOIN f.images fi ON fi.isPrimary = true 
            WHERE f.id IN :ids
            """)
    List<FoodSummaryProjection> findFoodSummariesByIds(@Param("ids") List<Long> ids);

    @Query("""
            SELECT 
                f.id AS foodId,
                c.name AS categoryName
            FROM Food f
            JOIN f.categories c
            WHERE f.id IN :ids
            """)
    List<FoodCategoryProjection> findCategoryNamesByFoodIds(@Param("ids") List<Long> ids);
}
