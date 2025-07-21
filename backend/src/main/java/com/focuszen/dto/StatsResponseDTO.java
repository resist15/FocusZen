package com.focuszen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatsResponseDTO {
    private int completedTasks;
    private int totalBreakMinutes;
    private int totalMindfulnessMinutes;
}
