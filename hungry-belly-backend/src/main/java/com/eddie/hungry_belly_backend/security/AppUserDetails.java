package com.eddie.hungry_belly_backend.security;

import com.eddie.hungry_belly_backend.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class AppUserDetails implements UserDetails {
    private final Long id;
    private final String email;
    private final String password;
    private final Collection<SimpleGrantedAuthority> authorities;

    public AppUserDetails(Long id, String email, String password, Collection<SimpleGrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static AppUserDetails buildUserDetails(User user) {
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .toList();

        return new AppUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities
        );


    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }


}
