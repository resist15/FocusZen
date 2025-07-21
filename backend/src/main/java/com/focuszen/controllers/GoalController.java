package com.focuszen.controllers;

import com.focuszen.dto.GoalDTO;
import com.focuszen.services.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(@RequestBody GoalDTO goalDTO, Authentication authentication) {
        String username = authentication.getName();
        GoalDTO createdGoal = goalService.createGoal(goalDTO, username);
        return ResponseEntity.ok(createdGoal);
    }

    @GetMapping
    public ResponseEntity<List<GoalDTO>> getUserGoals(Authentication authentication) {
        String username = authentication.getName();
        List<GoalDTO> goals = goalService.getUserGoals(username);
        return ResponseEntity.ok(goals);
    }

    @PutMapping("/{goalId}/progress")
    public ResponseEntity<GoalDTO> updateGoalProgress(
            @PathVariable Long goalId,
            @RequestParam int progress,
            Authentication authentication) {
        String username = authentication.getName();
        GoalDTO updatedGoal = goalService.updateProgress(goalId, progress, username);
        return ResponseEntity.ok(updatedGoal);
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long goalId, Authentication authentication) {
        String username = authentication.getName();
        goalService.deleteGoal(goalId, username);
        return ResponseEntity.noContent().build();
    }
}
