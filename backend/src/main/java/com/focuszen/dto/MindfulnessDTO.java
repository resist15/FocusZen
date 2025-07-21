package com.focuszen.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MindfulnessDTO {
    private Long id;
    private String activityType;
    private int startTime;
    private int durationInMinutes;
    private LocalDateTime timestamp;
}
