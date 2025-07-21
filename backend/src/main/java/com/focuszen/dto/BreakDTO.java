package com.focuszen.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreakDTO {
    private Long id;
    private String type;
    private int startTime;
    private int durationInMinutes;
    private LocalDateTime timestamp;
}
