package com.eddie.hungry_belly_backend.user.repository;

import com.eddie.hungry_belly_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean  existsByEmail(String email);
    User findByEmail(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.deleted = false")
    List<User> findAllWithRoles();

    @Query("UPDATE User u SET u.deleted = true WHERE u.id = ?1")
    @Modifying
    void deleteUserById(Long id);

    @Query("UPDATE User u SET u.enabled = :enabled WHERE u.id = :id")
    @Modifying
    void updateUserStatus(@Param("id") Long id,@Param("enabled") boolean isEnabled);

    Long countById(Long id);
}
