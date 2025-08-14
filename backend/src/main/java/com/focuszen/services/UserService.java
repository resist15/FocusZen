package com.focuszen.services;

import com.focuszen.dto.UserRequestDTO;
import com.focuszen.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO registerUser(UserRequestDTO userDto);
    UserResponseDTO getUserByEmail(String email);
}
