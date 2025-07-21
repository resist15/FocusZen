package com.focuszen.dto;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String profilePicture;
    private String username;
}
