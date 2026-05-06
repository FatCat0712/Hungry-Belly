package com.eddie.hungry_belly_backend.user.repository;

import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.user.projection.RoleUserCount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.email = ?1")
    User findByEmail(String email);

    // Pagination query - returns IDs only (no collection fetch)
    @Query(
            value = "SELECT u.id FROM users u",
            countQuery = "SELECT COUNT(*) FROM users",
            nativeQuery = true
    )
    Page<Long> findAllUserIds(Pageable pageable);

    @Query(value = """
            SELECT u.id            
            FROM users u
            WHERE 
                LOWER(u.first_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(u.last_name) LIKE LOWER(CONCAT('%', :keyword, '%'))  OR
                LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                CONCAT(LOWER(u.first_name), ' ', LOWER(u.last_name)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                EXISTS (
                    SELECT 1
                    FROM user_roles ur
                    LEFT JOIN roles r ON r.id = ur.role_id
                    WHERE ur.user_id = u.id
                    AND LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
            
            """,
            countQuery = """
                    SELECT COUNT(*)            
                    FROM users u
                    WHERE
                        LOWER(u.first_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                        LOWER(u.last_name) LIKE LOWER(CONCAT('%', :keyword, '%'))  OR
                        LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                        CONCAT(LOWER(u.first_name), ' ', LOWER(u.last_name)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                        EXISTS (
                            SELECT 1
                            FROM user_roles ur
                            LEFT JOIN roles r ON r.id = ur.role_id
                            WHERE ur.user_id = u.id
                            AND LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        )
                    """,
            nativeQuery = true)
    Page<Long> findAllUserIdsWithKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Bulk load users with roles by IDs - efficient fetch
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id IN :ids")
    List<User> findUserWithRolesByIds(@Param("ids") List<Long> ids);

    @Query("SELECT r.id AS roleId, COUNT(u) AS userCount FROM User u JOIN u.roles r GROUP BY r.id ORDER BY r.id")
    List<RoleUserCount> countUsersByRole();

    @Query("SELECT COUNT(*) FROM User u WHERE u.enabled = true")
    Long countActiveUser();

    @Query("SELECT COUNT(*) FROM User")
    Long countAllUsers();

    @Query("DELETE FROM  User u WHERE u.id = ?1")
    @Modifying
    void deleteUserById(Long id);

    @Query("UPDATE User u SET u.enabled = :enabled WHERE u.id = :id")
    @Modifying
    void updateUserStatus(@Param("id") Long id, @Param("enabled") boolean isEnabled);

    Long countById(Long id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = ?1")
    Optional<User> findUserById(Long id);

    @Query("SELECT COUNT(*) FROM User u JOIN u.roles r WHERE r.name = 'Admin' AND u.enabled = true")
    long countActiveAdmins();
}
