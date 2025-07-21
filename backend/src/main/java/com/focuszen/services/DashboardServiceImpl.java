package com.focuszen.services;

import com.focuszen.dto.DashboardSummaryDTO;
import com.focuszen.entity.User;
import com.focuszen.repositories.BreakRepository;
import com.focuszen.repositories.MindfulnessRepository;
import com.focuszen.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final BreakRepository breakRepository;
    private final MindfulnessRepository mindfulnessRepository;

    @Override
    public DashboardSummaryDTO getSummaryForToday(User user) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        long tasksCompleted = taskRepository.countByUserAndCompletedTrueAndDueDateBetween(user, start, end);
        long totalBreakMinutes = breakRepository.sumDurationInMinutesByUserAndDateBetween(user, start, end);
        long totalMindfulnessMinutes = mindfulnessRepository.sumDurationInMinutesByUserAndDateBetween(user, start, end);

        return new DashboardSummaryDTO(tasksCompleted, totalBreakMinutes, totalMindfulnessMinutes);
    }
}
