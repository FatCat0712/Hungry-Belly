package com.eddie.hungry_belly_backend.service;

import com.eddie.hungry_belly_backend.entity.AppUser;
import com.eddie.hungry_belly_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser existingAppUser =  userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new User(existingAppUser.getEmail(), existingAppUser.getPassword(), Collections.emptyList());
    }
}
