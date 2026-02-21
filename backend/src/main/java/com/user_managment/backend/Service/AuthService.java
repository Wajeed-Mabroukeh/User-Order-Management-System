package com.user_managment.backend.Service;

import com.user_managment.backend.Dto.AuthResponse;
import com.user_managment.backend.Dto.LoginRequest;
import com.user_managment.backend.Dto.RegisterRequest;
import com.user_managment.backend.Entity.User;
import com.user_managment.backend.Repository.UserRepository;
import com.user_managment.backend.Security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResult register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return createAuthResult(savedUser);
    }

    public AuthResult login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        return createAuthResult(user);
    }

    private AuthResult createAuthResult(User user) {
        String token = jwtService.generateToken(user, user.getId());
        return new AuthResult(AuthResponse.fromUser(user), token);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    public record AuthResult(AuthResponse response, String token) {
    }
}
