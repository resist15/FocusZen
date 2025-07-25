package com.focuszen.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.focuszen.dto.DashboardSummaryDTO;
import com.focuszen.entity.Routine;
import com.focuszen.entity.User;
import com.focuszen.repositories.BreakRepository;
import com.focuszen.repositories.GoalRepository;
import com.focuszen.repositories.MindfulnessRepository;
import com.focuszen.repositories.RoutineEntryRepository;
import com.focuszen.repositories.RoutineRepository;
import com.focuszen.repositories.TaskRepository;
import com.focuszen.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final BreakRepository breakRepository;
    private final MindfulnessRepository mindfulnessLogRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final RoutineRepository routineRepository;
    private final RoutineEntryRepository routineEntryRepository;
    
    public DashboardSummaryDTO getSummary(String username) {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        long totalTasks = taskRepository.countByUser(user);
        long completedTasks = taskRepository.countByUserAndCompletedTrue(user);
        long totalGoals = goalRepository.countByUser(user);
        long breakCount = breakRepository.countByUser(user);
        long mindfulnessCount = mindfulnessLogRepository.countByUser(user);

        List<Routine> activeRoutines = routineRepository.findByUserAndActiveTrue(user);
        long totalExpectedEntries = (long) activeRoutines.size() * 7;
        LocalDate now = LocalDate.now();
        long actualEntries = routineEntryRepository.countByRoutineUserAndDateBetween(
            user,
            now.minusDays(6),
            now
        );

        double weeklyRoutineCompletion = totalExpectedEntries > 0
            ? (double) actualEntries * 100 / totalExpectedEntries
            : 0;

        return new DashboardSummaryDTO(
            totalTasks,
            completedTasks,
            totalGoals,
            breakCount,
            mindfulnessCount,
            weeklyRoutineCompletion
        );
    }

}
