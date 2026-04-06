package com.eddie.hungry_belly_backend.security.jwt;

import com.eddie.hungry_belly_backend.common.util.CookieUtils;
import com.eddie.hungry_belly_backend.security.AppUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

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
    private AppUserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = cookieUtils.extractTokenFromCookies(request, "accessToken");
            if(StringUtils.hasText(token) && jwtUtils.validateToken(token)) {
                String username  = jwtUtils.getUsernameFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        filterChain.doFilter(request, response);
    }


}
