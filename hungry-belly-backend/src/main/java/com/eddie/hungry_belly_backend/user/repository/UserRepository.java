package com.eddie.hungry_belly_backend.user.repository;

import com.eddie.hungry_belly_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
