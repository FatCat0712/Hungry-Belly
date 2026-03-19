package com.eddie.hungry_belly_backend.role;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.role.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class RoleRepositoryTests {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleRepositoryTests(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Test
    public void testCreateFirstRole() {
        Role roleAdmin = new Role("Admin", "manage everything");
        roleAdmin = roleRepository.save(roleAdmin);
        assertThat(roleAdmin.getId()).isGreaterThan(0);
    }

    @Test
    public void testCreateRemainingRoles() {
        Role roleUser = new Role("User", "normal user");
        Role roleStaff = new Role("Staff", "manage orders, products, deliveries and sales reports");
        Role roleSupport = new Role("Support", "manage questions and reviews");
        Role roleShipper = new Role("Shipper", "view products, view orders, update order status and deliver");

        List<Role> roleList = (List<Role>) roleRepository.saveAll(List.of(roleUser, roleStaff, roleSupport, roleShipper));
        assertThat(roleList.size()).isGreaterThan(0);
    }
}
