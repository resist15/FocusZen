package com.focuszen.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalDTO {
    private Long id;
    private String title;
    private String description;
    private int targetValue;
    private int currentValue;
    private LocalDate deadline;
    private boolean completed;
}