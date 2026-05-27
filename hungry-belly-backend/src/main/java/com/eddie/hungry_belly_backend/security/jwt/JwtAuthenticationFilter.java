package com.eddie.hungry_belly_backend.security.jwt;

import com.eddie.hungry_belly_backend.common.util.CookieUtils;
import com.eddie.hungry_belly_backend.entity.user.User;
import com.eddie.hungry_belly_backend.security.AppUserDetails;
import com.eddie.hungry_belly_backend.user.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final CookieUtils cookieUtils;
    private final UserService userService;


    @Override
    protected void doFilterInternal(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain
    ) throws ServletException, IOException {
        String token = cookieUtils.extractTokenFromCookies(request, "accessToken");

        if (StringUtils.hasText(token)) {
            try {
                jwtUtils.validateToken(token);
                Authentication existing = SecurityContextHolder.getContext().getAuthentication();
                if(existing == null) {
                    Long id = jwtUtils.getUserIdFromToken(token);
                    User savedUser = userService.findUserById(id); // Check if user exists, will throw if not
                    UserDetails principal = AppUserDetails.buildUserDetails(savedUser); // Check if user exists, will throw if not
                    var auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }


            } catch (JwtException | IllegalArgumentException | UsernameNotFoundException ex) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }


}
