package com.eddie.hungry_belly_backend.security.jwt;

import com.eddie.hungry_belly_backend.security.AppUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Component
@ConfigurationProperties(prefix = "auth.token")
public class JwtUtils {
    private String accessExpirationInMils;
    private String refreshExpirationInMils;
    private String jwtSecret;

    public String generateAccessToken(Authentication authentication) {
        AppUserDetails userPrincipal = (AppUserDetails) authentication.getPrincipal();

        List<String> roles = userPrincipal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("id", userPrincipal.getId())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationDate(accessExpirationInMils))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();

    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationDate(refreshExpirationInMils))
                .claim("jti", UUID.randomUUID().toString())
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public List<String> getRolesFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        Object raw = claims.get("roles");
        if(raw instanceof List<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        return List.of();
    }

    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    private Date calculateExpirationDate(String expirationTimeString) {
        long expirationTime = Long.parseLong(expirationTimeString); // Convert String to long
        return new Date(System.currentTimeMillis() + expirationTime);
    }



    public boolean validateToken(String token) {
        try {
          getClaimsFromToken(token);
            return true;
        }catch (JwtException e) {
            throw new JwtException(e.getMessage());
        }
    }

}
