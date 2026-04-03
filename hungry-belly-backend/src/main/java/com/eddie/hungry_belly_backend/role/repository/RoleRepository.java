package com.eddie.hungry_belly_backend.role.repository;

import com.eddie.hungry_belly_backend.entity.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {
    Set<Role> findByNameIn(Set<String> names);

    @Query("SELECT r FROM Role r JOIN FETCH r.permissions ORDER BY r.id")
    List<Role> fetchRolesWithPermissions();

    @Query("SELECT r FROM Role r JOIN FETCH r.permissions WHERE r.id = ?1")
    Optional<Role> fetchRoleById(Long id);


}
