package com.focuszen.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.focuszen.entity.Task;
import com.focuszen.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserAndCompleted(User user, boolean completed);
    long countByUserAndCompletedTrueAndDueDateBetween(User user, LocalDateTime start, LocalDateTime end);
    int countByUserAndCompletedTrueAndDueDateAfter(User user, LocalDateTime since);
    long countByUser(User user);
    long countByUserAndCompletedTrue(User user);
}
