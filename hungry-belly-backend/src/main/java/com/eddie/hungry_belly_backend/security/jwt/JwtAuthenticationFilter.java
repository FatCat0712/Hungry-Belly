package com.eddie.hungry_belly_backend.security.jwt;

import com.eddie.hungry_belly_backend.common.util.CookieUtils;
import io.jsonwebtoken.JwtException;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // This filter will intercept incoming requests and validate the JWT token
    // If the token is valid, it will set the authentication in the security context
    // If the token is invalid or missing, it will not set the authentication and the request will be rejected by the JwtEntryPoint
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CookieUtils cookieUtils;

    @Autowired
    private JwtAuthenticationEntryPoint authenticationEntryPoint;


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
                    String username  = jwtUtils.getUsernameFromToken(token);
                    List<SimpleGrantedAuthority> authorities = jwtUtils.getRolesFromToken(token).stream()
                            .map(SimpleGrantedAuthority::new)
                            .toList();
                    var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }


            } catch (JwtException | IllegalArgumentException | UsernameNotFoundException ex) {
                SecurityContextHolder.clearContext();
                authenticationEntryPoint.commence(
                        request,
                        response,
                        new BadCredentialsException("Invalid or expired access token", ex)
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }


}
