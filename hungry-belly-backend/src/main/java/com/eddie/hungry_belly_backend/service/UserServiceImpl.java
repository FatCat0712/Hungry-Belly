package com.eddie.hungry_belly_backend.service;

import com.eddie.hungry_belly_backend.entity.AppUser;
import com.eddie.hungry_belly_backend.io.UserRequest;
import com.eddie.hungry_belly_backend.io.UserResponse;
import com.eddie.hungry_belly_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        AppUser newAppUser = convertToEntity(request);
        newAppUser = userRepository.save(newAppUser);
        return convertToResponse(newAppUser) ;
    }

    @Override
    public AppUser findByUserId() {
        String loggedInEmail = authenticationFacade.getAuthentication().getName();
        return userRepository.findByEmail(loggedInEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));

    }

    private AppUser convertToEntity(UserRequest request) {
       return AppUser.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
    }

    private UserResponse convertToResponse(AppUser registeredAppUser) {
        return UserResponse.builder()
                .id(registeredAppUser.getId())
                .name(registeredAppUser.getName())
                .email(registeredAppUser.getEmail())
                .build();
    }
}
