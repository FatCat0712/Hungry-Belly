package com.eddie.hungry_belly_backend.role.repository;

import com.eddie.hungry_belly_backend.entity.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {
    Set<Role> findByNameIn(Set<String> names);
}
