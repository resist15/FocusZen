package com.focuszen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardSummaryDTO {
    private long totalTasks;
    private long completedTasks;
    private long totalGoals;
    private long breakCount;
    private long mindfulnessCount;
    private double weeklyRoutineCompletion;
}
