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
    private long startTime;
    private long durationInMinutes;
    private LocalDateTime timestamp;
}
