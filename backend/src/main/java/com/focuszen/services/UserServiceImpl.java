package com.focuszen.services;

import org.springframework.stereotype.Service;

import com.focuszen.dto.UserRequestDTO;
import com.focuszen.dto.UserResponseDTO;
import com.focuszen.entity.User;
import com.focuszen.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserResponseDTO registerUser(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("User already exists with email: " + dto.getEmail());
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .profilePicture(dto.getProfilePicture())
                .build();

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mapToResponse(user);
    }

    private UserResponseDTO mapToResponse(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setProfilePicture(user.getProfilePicture());
        return dto;
    }
}
