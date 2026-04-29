package com.eddie.hungry_belly_backend.category.repository;

import com.eddie.hungry_belly_backend.category.dto.CategoryFlatView;
import com.eddie.hungry_belly_backend.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);

    @Query(
            value = """
                    SELECT c.id 
                    FROM categories c
                    WHERE LOWER(c.name) LIKE LOWER(CONCAT('%',:keyword ,'%'))
                    OR LOWER(c.alias) LIKE LOWER(CONCAT('%',:keyword,'%'))                    
                    """
            , countQuery = """
                SELECT COUNT(*)
                FROM categories c
                WHERE LOWER(c.name) LIKE LOWER(CONCAT('%',:keyword ,'%'))
                OR LOWER(c.alias) LIKE LOWER(CONCAT('%',:keyword,'%'))             
            """,
            nativeQuery = true)
    Page<Long> findCategoriesWithKeyword(String keyword, Pageable pageable);

    @Query( value = """
                    SELECT c.id 
                    FROM categories c
                    """
            , countQuery = """
                SELECT COUNT(*)
                FROM categories c
            """,
            nativeQuery = true)
    Page<Long> findAllCategoryIds(Pageable pageable);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parent WHERE c.id IN :ids")
    List<Category> findCategoryInIds(@Param("ids") List<Long> ids);

    @Query("SELECT c FROM Category c WHERE c.name IN :categories")
    Set<Category> finCategoriesInSet(@Param("categories") Set<String> categories);

    @Query("""
                SELECT c.id AS id, c.name AS name, c.parent.id AS parentId
                FROM Category c
                WHERE c.enabled = true
                ORDER BY c.name ASC
            """)
    List<CategoryFlatView> findAllEnabledFlat();


}
