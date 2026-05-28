package com.eddie.hungry_belly_backend.user.service;

import com.eddie.hungry_belly_backend.common.util.export.ExportService;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.email.service.EmailService;
import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.user.User;
import com.eddie.hungry_belly_backend.exception.common.BadRequestException;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import com.eddie.hungry_belly_backend.user.dto.request.RegisterRequest;
import com.eddie.hungry_belly_backend.user.dto.response.UserResponse;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceRegistrationTests {

    @Mock
    private RoleService roleService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ExportService exportService;

    @Mock
    private StorageService storageService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    @Test
    void createNewCustomer_shouldSaveCustomerWithRoleAndCreateVerification() {
        RegisterRequest request = buildRegisterRequest();
        Role roleUser = new Role("ROLE_USER", "customer role");

        when(userRepository.existsByEmail("customer@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(roleService.getExistRoleWithSameName("ROLE_USER")).thenReturn(roleUser);
        when(storageService.generateDownloadUrl("avatars/customer.png", 3600)).thenReturn("https://example.com/photo");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        UserResponse response = userService.createNewCustomer(request);

        ArgumentCaptor<User> savedUserCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUserCaptor.capture());

        User savedUser = savedUserCaptor.getValue();
        assertThat(savedUser.getEmail()).isEqualTo("customer@example.com");
        assertThat(savedUser.getFirstName()).isEqualTo("John");
        assertThat(savedUser.getLastName()).isEqualTo("Doe");
        assertThat(savedUser.getPassword()).isEqualTo("encoded-password");
        assertThat(savedUser.isEnabled()).isFalse();
        assertThat(savedUser.getPhoto()).isEqualTo("avatars/customer.png");
        assertThat(savedUser.getRoles()).containsExactly(roleUser);

        String verificationToken = RandomStringUtils.randomAlphanumeric(64);
        verify(emailService).createEmailVerification(savedUser, verificationToken);

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getEmail()).isEqualTo("customer@example.com");
        assertThat(response.isEnabled()).isFalse();
        assertThat(response.getRoles()).containsExactly("ROLE_USER");
        assertThat(response.getPhotoPath()).isEqualTo("avatars/customer.png");
        assertThat(response.getPhotoUrl()).isEqualTo("https://example.com/photo");
    }

    @Test
    void createNewCustomer_shouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = buildRegisterRequest();

        when(userRepository.existsByEmail("customer@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.createNewCustomer(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("email: Email already exists");

        verify(userRepository, never()).save(any(User.class));
        verify(roleService, never()).getExistRoleWithSameName(anyString());
        verify(emailService, never()).createEmailVerification(any(User.class), anyString());
    }

    private RegisterRequest buildRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        ReflectionTestUtils.setField(request, "email", "customer@example.com");
        ReflectionTestUtils.setField(request, "firstName", "John");
        ReflectionTestUtils.setField(request, "lastName", "Doe");
        ReflectionTestUtils.setField(request, "password", "password123");
        ReflectionTestUtils.setField(request, "photoPath", "avatars/customer.png");
        ReflectionTestUtils.setField(request, "phoneNumber", "0900000000");
        return request;
    }
}

