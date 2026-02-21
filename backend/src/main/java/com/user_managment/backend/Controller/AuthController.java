package com.user_managment.backend.Controller;

import com.user_managment.backend.Dto.AuthResponse;
import com.user_managment.backend.Dto.LoginRequest;
import com.user_managment.backend.Dto.RegisterRequest;
import com.user_managment.backend.Service.AuthService;
import com.user_managment.backend.Security.AuthCookieService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieService authCookieService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthService.AuthResult authResult = authService.register(request);
        response.addHeader(HttpHeaders.SET_COOKIE, authCookieService.buildAuthCookie(authResult.token()).toString());
        return authResult.response();
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthService.AuthResult authResult = authService.login(request);
        response.addHeader(HttpHeaders.SET_COOKIE, authCookieService.buildAuthCookie(authResult.token()).toString());
        return authResult.response();
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, authCookieService.buildExpiredAuthCookie().toString());
    }
}
