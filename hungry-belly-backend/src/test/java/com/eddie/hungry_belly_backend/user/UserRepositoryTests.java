package com.eddie.hungry_belly_backend.user;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class UserRepositoryTests {
    private final UserRepository userRepository;
    private final TestEntityManager testEntityManager;

    @Autowired
    public UserRepositoryTests(UserRepository userRepository, TestEntityManager testEntityManager) {
        this.userRepository = userRepository;
        this.testEntityManager = testEntityManager;
    }

    @Test
    public void testCreateUser() {
        Role roleAdmin = testEntityManager.find(Role.class, 1L);
        User userNamHM = User.builder()
                .email("nam@codejava.net")
                .password("nam2020")
                .firstName("Nam")
                .lastName("Ha Minh")
                .build();
        userNamHM.addRole(roleAdmin);

        userNamHM = userRepository.save(userNamHM);

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

        userRavi.addRole(new Role(3L));
        userRavi.addRole(new Role(4L));

        userRavi = userRepository.save(userRavi);
        assertThat(userRavi.getRoles().size()).isGreaterThan(1);
    }

    @Test
    public void testListAllUsers() {
        List<User> userList = userRepository.findAll();
        userList.forEach(System.out::println);
        assertThat(userList.size()).isGreaterThan(0);
    }

    @Test
    public void testGetUserById() {
        Optional<User> existUser = userRepository.findById(1L);
        assertThat(existUser).isPresent();
    }

    @Test
    public void testUpdateUserDetails() {
        Optional<User> existUser = userRepository.findById(1L);

        existUser.ifPresent((user) -> {
                user.setEmail("namjavaprogrammer@gmail.com");
                user.setEnabled(true);
                userRepository.save(user);
        });

        Optional<User> updatedUser = userRepository.findById(1L);

        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().getEmail()).isEqualTo("namjavaprogrammer@gmail.com");
        assertThat(updatedUser.get().isEnabled()).isTrue();
    }

    @Test
    public void testUpdateUserRoles() {
        Optional<User> userRavi = userRepository.findById(2L);
        Role roleStaff = new Role(3L);
        Role roleSupport = new Role(4L);

        userRavi.ifPresent((user) -> {
            user.getRoles().remove(roleStaff);
            user.getRoles().remove(roleSupport);
            userRepository.save(user);
        });

        Optional<User> updatedUser = userRepository.findById(2L);

        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().getRoles()).isEmpty();
    }

    @Test
    public void testDeleteUser() {
        Optional<User> userRavi = userRepository.findById(2L);

        userRavi.ifPresent(user -> {
            user.setDeleted(true);
            userRepository.save(user);
        });

        Optional<User> updatedUser = userRepository.findById(2L);

        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().isDeleted()).isTrue();


    }
}
