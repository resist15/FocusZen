package com.focuszen.services;

import com.focuszen.dto.StatsResponseDTO;
import com.focuszen.entity.Task;
import com.focuszen.entity.User;
import com.focuszen.repositories.BreakRepository;
import com.focuszen.repositories.TaskRepository;
import com.focuszen.repositories.UserRepository;
import com.focuszen.services.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final TaskRepository taskRepository;
    private final BreakRepository breakRepository;
    private final UserRepository userRepository;

    @Override
    public StatsResponseDTO getWeeklyStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);

        int completedTasks = taskRepository.countByUserAndCompletedTrueAndDueDateAfter(user, oneWeekAgo);
        int totalBreakMinutes = breakRepository.sumDurationByUserSince(user.getId(), oneWeekAgo);
        int totalMindfulnessMinutes = 0;
        return new StatsResponseDTO(completedTasks, totalBreakMinutes, totalMindfulnessMinutes);
    }
}
