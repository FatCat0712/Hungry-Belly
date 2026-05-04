package com.eddie.hungry_belly_backend.common.util;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class CookieUtilsTests {

    private final CookieUtils cookieUtils = new CookieUtils();

    @Test
    void addTokenCookieOmitsSecureWhenDisabled() {
        ReflectionTestUtils.setField(cookieUtils, "useSecureCookies", false);
        MockHttpServletResponse response = new MockHttpServletResponse();

        cookieUtils.addTokenCookie(response, "accessToken", "token-value", 300_000);

        String cookieHeader = response.getHeader("Set-Cookie");
        assertThat(cookieHeader).contains("SameSite=Lax");
        assertThat(cookieHeader).doesNotContain("; Secure");
    }

    @Test
    void addTokenCookieKeepsSecureForCrossSiteCookies() {
        ReflectionTestUtils.setField(cookieUtils, "useSecureCookies", true);
        MockHttpServletResponse response = new MockHttpServletResponse();

        cookieUtils.addTokenCookie(response, "accessToken", "token-value", 300_000);

        String cookieHeader = response.getHeader("Set-Cookie");
        assertThat(cookieHeader).contains("; Secure");
        assertThat(cookieHeader).contains("SameSite=None");
    }

    @Test
    void clearCookieUsesConfiguredSecurityMode() {
        ReflectionTestUtils.setField(cookieUtils, "useSecureCookies", false);
        MockHttpServletResponse response = new MockHttpServletResponse();

        cookieUtils.clearCookie(response, "refreshToken");

        String cookieHeader = response.getHeader("Set-Cookie");
        assertThat(cookieHeader).contains("Max-Age=0");
        assertThat(cookieHeader).contains("SameSite=Lax");
        assertThat(cookieHeader).doesNotContain("; Secure");
    }
}
