package com.user_managment.backend.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class AuthCookieService {

    private final JwtService jwtService;
    private final String cookieName;
    private final boolean secureCookie;
    private final String sameSite;
    private final String cookiePath;

    public AuthCookieService(
            JwtService jwtService,
            @Value("${jwt.cookie.name:access_token}") String cookieName,
            @Value("${jwt.cookie.secure:false}") boolean secureCookie,
            @Value("${jwt.cookie.same-site:Lax}") String sameSite,
            @Value("${jwt.cookie.path:/}") String cookiePath) {
        this.jwtService = jwtService;
        this.cookieName = cookieName;
        this.secureCookie = secureCookie;
        this.sameSite = sameSite;
        this.cookiePath = cookiePath;
    }

    public String getCookieName() {
        return cookieName;
    }

    public ResponseCookie buildAuthCookie(String jwtToken) {
        long maxAgeSeconds = Math.max(0L, jwtService.getJwtExpirationMs() / 1000L);
        return ResponseCookie.from(cookieName, jwtToken)
                .httpOnly(true)
                .secure(secureCookie)
                .path(cookiePath)
                .sameSite(sameSite)
                .maxAge(maxAgeSeconds)
                .build();
    }

    public ResponseCookie buildExpiredAuthCookie() {
        return ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(secureCookie)
                .path(cookiePath)
                .sameSite(sameSite)
                .maxAge(0)
                .build();
    }
}
