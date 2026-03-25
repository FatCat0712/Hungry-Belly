package com.eddie.hungry_belly_backend.user;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTests {
    private final UserRepository userRepository;
    private final TestEntityManager testEntityManager;

    private Role adminRole;
    private Role userRole;
    private Role staffRole;
    private Role supportRole;
    private Role shipperRole;

    private User existingUser;
    private User userWithTwoRoles;

    @Autowired
    public UserRepositoryTests(UserRepository userRepository, TestEntityManager testEntityManager) {
        this.userRepository = userRepository;
        this.testEntityManager = testEntityManager;
    }

    @BeforeEach
    public void setUp() {
        adminRole = new Role("Admin", "manage everything");
        userRole = new Role("User", "normal user");
        staffRole = new Role("Staff", "manage orders, products, deliveries and sales reports");
        supportRole = new Role("Support", "manage questions and reviews");
        shipperRole = new Role("Shipper", "view products, view orders, update order status and deliver");

        testEntityManager.persist(adminRole);
        testEntityManager.persist(userRole);
        testEntityManager.persist(staffRole);
        testEntityManager.persist(supportRole);
        testEntityManager.persist(shipperRole);
        testEntityManager.flush();

        existingUser = User.builder()
                .email("existing.user@example.com")
                .password("password")
                .firstName("Existing")
                .lastName("User")
                .enabled(true)
                .build();
        existingUser.addRole(userRole);
        existingUser = userRepository.saveAndFlush(existingUser);

        userWithTwoRoles = User.builder()
                .email("two.roles@example.com")
                .password("password")
                .firstName("Two")
                .lastName("Roles")
                .enabled(true)
                .build();
        userWithTwoRoles.addRole(staffRole);
        userWithTwoRoles.addRole(supportRole);
        userWithTwoRoles = userRepository.saveAndFlush(userWithTwoRoles);

        User shipperUser = User.builder()
                .email("shipper.user@example.com")
                .password("password")
                .firstName("Shipper")
                .lastName("User")
                .enabled(true)
                .build();
        shipperUser.addRole(shipperRole);
        userRepository.saveAndFlush(shipperUser);

        testEntityManager.getEntityManager().clear();
    }

    @Test
    public void testCreateUser() {
        User userNamHM = User.builder()
                .email("nam@codejava.net")
                .password("nam2020")
                .firstName("Nam")
                .lastName("Ha Minh")
                .build();
        userNamHM.addRole(testEntityManager.find(Role.class, adminRole.getId()));

        userNamHM = userRepository.saveAndFlush(userNamHM);

        assertThat(userNamHM.getId()).isGreaterThan(0);
    }

    @Test
    public void testCreateUserWithTwoRoles() {
        User userRavi = User.builder()
                .email("ravi@gmail.com")
                .password("ravi2020")
                .firstName("Ravi")
                .lastName("Kumar")
                .build();

        userRavi.addRole(testEntityManager.find(Role.class, staffRole.getId()));
        userRavi.addRole(testEntityManager.find(Role.class, supportRole.getId()));

        userRavi = userRepository.saveAndFlush(userRavi);
        assertThat(userRavi.getRoles().size()).isGreaterThan(1);
    }

    @Test
    public void testListAllUsers() {
        List<User> userList = userRepository.findAll();
        assertThat(userList).hasSize(3);
    }

    @Test
    public void testGetUserById() {
        Optional<User> existUser = userRepository.findById(existingUser.getId());
        assertThat(existUser).isPresent();
    }

    @Test
    public void testUpdateUserDetails() {
        Optional<User> existUser = userRepository.findById(existingUser.getId());

        existUser.ifPresent((user) -> {
                user.setEmail("namjavaprogrammer@gmail.com");
                user.setEnabled(true);
                userRepository.save(user);
        });

        Optional<User> updatedUser = userRepository.findById(existingUser.getId());

        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().getEmail()).isEqualTo("namjavaprogrammer@gmail.com");
        assertThat(updatedUser.get().isEnabled()).isTrue();
    }

    @Test
    public void testUpdateUserRoles() {
        Optional<User> userRavi = userRepository.findById(userWithTwoRoles.getId());
        Role roleStaff = testEntityManager.find(Role.class, staffRole.getId());
        Role roleSupport = testEntityManager.find(Role.class, supportRole.getId());

        userRavi.ifPresent((user) -> {
            user.getRoles().remove(roleStaff);
            user.getRoles().remove(roleSupport);
            userRepository.save(user);
        });

        Optional<User> updatedUser = userRepository.findById(userWithTwoRoles.getId());

        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().getRoles()).isEmpty();
    }

    @Test
    public void testDeleteUser() {
        Optional<User> userRavi = userRepository.findById(userWithTwoRoles.getId());

        userRavi.ifPresent(user -> {
            user.setDeleted(true);
            userRepository.save(user);
        });

        Optional<User> updatedUser = userRepository.findById(userWithTwoRoles.getId());

        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().isDeleted()).isTrue();
    }

    @Test
    public void testGetUserByEmail() {
        assertThat(userRepository.existsByEmailAndDeletedFalse(existingUser.getEmail())).isTrue();
        assertThat(userRepository.existsByEmailAndDeletedFalse("abc@def.com")).isFalse();
    }

    @Test
    public void testCountById() {
        Long id = existingUser.getId();
        Long countById = userRepository.countById(id);

        assertThat(countById).isEqualTo(1L);
    }

    @Test
    public void testDisableUser() {
        Long id = existingUser.getId();
        userRepository.updateUserStatus(id, false);

        testEntityManager.getEntityManager().clear();

        Optional<User> dbUser = userRepository.findById(id);

        assertThat(dbUser).isPresent();
        assertThat(dbUser.get().isEnabled()).isFalse();
    }
}
