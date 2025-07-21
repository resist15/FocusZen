package com.focuszen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardSummaryDTO {
    private long tasksCompletedToday;
    private long totalBreakMinutes;
    private long totalMindfulnessMinutes;
}
