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
    boolean  existsByEmailAndDeletedFalse(String email);
    User findByEmail(String email);

    // Pagination query - returns IDs only (no collection fetch)
    @Query("SELECT u.id FROM User u WHERE u.deleted = false")
    Page<Long> findAllUserIds(Pageable pageable);

    @Query("SELECT u.id FROM User u WHERE u.deleted = false AND (" +
            "u.firstName LIKE %?1% OR " +
            "u.lastName LIKE %?1% OR " +
            "CONCAT(u.firstName,' ',u.lastName) LIKE %?1% OR " +
            "u.email LIKE %?1% OR " +
            "CONCAT(u.id,'') LIKE ?1)")
    Page<Long> findAllUserIdsWithKeyword(String keyword, Pageable pageable);
    
    // Bulk load users with roles by IDs - efficient fetch
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id IN :ids")
    List<User> findAllWithRolesByIds(@Param("ids") List<Long> ids);


    @Query("SELECT r.id AS roleId, COUNT(u) AS userCount FROM User u JOIN u.roles r GROUP BY r.id ORDER BY r.id")
    List<RoleUserCount> countUsersByRole();


    @Query("SELECT COUNT(*) FROM User u WHERE u.enabled = true")
    Long countActiveUser();

    @Query("SELECT COUNT(*) FROM User u WHERE u.deleted = false")
    Long countAllUsers();


    @Query("UPDATE User u SET u.deleted = true, u.enabled = false WHERE u.id = ?1")
    @Modifying
    void deleteUserById(Long id);

    @Query("UPDATE User u SET u.enabled = :enabled WHERE u.id = :id")
    @Modifying
    void updateUserStatus(@Param("id") Long id,@Param("enabled") boolean isEnabled);

    Long countById(Long id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = ?1 AND u.deleted = false")
    Optional<User> findUserById(Long id);
}
