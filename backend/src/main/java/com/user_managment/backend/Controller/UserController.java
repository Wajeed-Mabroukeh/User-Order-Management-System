package com.user_managment.backend.Controller;

import com.user_managment.backend.Dto.UserProfileResponse;
import com.user_managment.backend.Entity.User;
import com.user_managment.backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserProfileResponse getCurrentUserProfile(@AuthenticationPrincipal User authenticatedUser) {
        return userService.getCurrentUserProfile(authenticatedUser);
    }
}
