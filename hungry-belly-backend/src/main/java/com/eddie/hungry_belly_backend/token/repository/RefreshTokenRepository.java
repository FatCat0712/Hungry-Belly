package com.eddie.hungry_belly_backend.token.repository;

import com.eddie.hungry_belly_backend.entity.RefreshToken;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select rt from RefreshToken rt where rt.token = :token")
    Optional<RefreshToken> findByTokenForUpdate(@Param("token") String token);


    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "delete rt from refresh_token rt INNER JOIN users u ON rt.user_id = u.id WHERE u.email = :email", nativeQuery = true)
    void deleteByUserEmail(@Param("email") String email);

    @Modifying
    void deleteAllByFamilyId(Long familyId);
}
