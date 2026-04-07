package com.eddie.hungry_belly_backend.common.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CookieUtils {

    @Value("${app.useSecureCookie}")
    private boolean useSecureCookies;

    public void addTokenCookie(HttpServletResponse response, String tokenName, String token, long maxAge) {
        if(response == null) {
            throw new IllegalArgumentException("HttpServletResponse cannot be null");
        }

        Cookie tokenCookie = new Cookie(tokenName, token);
        tokenCookie.setHttpOnly(true);
        tokenCookie.setPath("/");
        tokenCookie.setMaxAge((int)(maxAge/1000));
        tokenCookie.setSecure(useSecureCookies);
        String sameSite = "None";
        setResponseHeader(response, tokenCookie, sameSite);
    }

    private void setResponseHeader(HttpServletResponse response, Cookie tokenCookie, String sameSite) {
        String cookieHeader = tokenCookie.getName() +
                "=" +
                tokenCookie.getValue() +
                "; HttpOnly; Path=" + tokenCookie.getPath() +
                "; Max-Age=" + tokenCookie.getMaxAge() +
                "; Secure" +
                "; SameSite=" + sameSite;

        response.addHeader("Set-Cookie", cookieHeader);
    }

    public String extractTokenFromCookies(HttpServletRequest request, String cookiesName) {
        if(request.getCookies() == null) return null;
        for(Cookie cookie : request.getCookies()) {
            if(cookiesName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    public void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    public void logCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        System.out.println("Cookies: " + (cookies != null ? Arrays.toString(cookies) : "null"));
        if(cookies != null) {
            for(Cookie cookie: cookies) {
                System.out.println("Cookie name: " + cookie.getName() + ", value: " + cookie.getValue());
            }
        }
    }
}
