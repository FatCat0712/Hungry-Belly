package com.eddie.hungry_belly_backend.permission.repository;

import com.eddie.hungry_belly_backend.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findByIdIn(List<Long> ids);
}
