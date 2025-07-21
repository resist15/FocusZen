package com.focuszen.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskResponseDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private boolean completed;
}
