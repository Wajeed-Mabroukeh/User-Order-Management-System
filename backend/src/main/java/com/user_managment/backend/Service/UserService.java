package com.user_managment.backend.Service;

import com.user_managment.backend.Dto.UserProfileResponse;
import com.user_managment.backend.Entity.User;
import com.user_managment.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getCurrentUserProfile(User authenticatedUser) {
        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return UserProfileResponse.fromUser(user);
    }
}
