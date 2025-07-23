package com.focuszen.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.focuszen.dto.DashboardSummaryDTO;
import com.focuszen.entity.User;
import com.focuszen.repositories.BreakRepository;
import com.focuszen.repositories.MindfulnessRepository;
import com.focuszen.repositories.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final BreakRepository breakRepository;
    private final MindfulnessRepository mindfulnessRepository;

    @Override
    public DashboardSummaryDTO getSummaryForToday(User user) {
        LocalDate today = LocalDate.now();
        LocalDateTime startTask = today.atStartOfDay();
        LocalDateTime endTask = today.plusDays(1).atStartOfDay();
        int start = Integer.parseInt(today.format(DateTimeFormatter.BASIC_ISO_DATE)); // yyyyMMdd
        int end = Integer.parseInt(today.plusDays(1).format(DateTimeFormatter.BASIC_ISO_DATE)); // next day

        long tasksCompleted = taskRepository.countByUserAndCompletedTrueAndDueDateBetween(user, startTask, endTask);
        long totalBreakMinutes = breakRepository.sumDurationInMinutesByUserAndDateBetween(user, start, end);
        long totalMindfulnessMinutes = mindfulnessRepository.sumDurationInMinutesByUserAndDateBetween(user, start, end);

        return new DashboardSummaryDTO(tasksCompleted, totalBreakMinutes, totalMindfulnessMinutes);
    }
}
