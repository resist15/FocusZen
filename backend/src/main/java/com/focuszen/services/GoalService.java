package com.focuszen.services;

import com.focuszen.dto.GoalDTO;

import java.util.List;

public interface GoalService {
    GoalDTO createGoal(GoalDTO goalDTO, String username);
    List<GoalDTO> getUserGoals(String username);
    GoalDTO updateProgress(Long goalId, int progress, String username);
    void deleteGoal(Long goalId, String username);
}
