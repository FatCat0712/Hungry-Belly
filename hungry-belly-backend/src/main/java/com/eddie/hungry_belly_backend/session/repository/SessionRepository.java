package com.eddie.hungry_belly_backend.session.repository;

import com.eddie.hungry_belly_backend.entity.user.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<UserSession, Long> {
}
