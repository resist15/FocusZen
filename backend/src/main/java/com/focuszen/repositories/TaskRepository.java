package com.focuszen.repositories;

import com.focuszen.entity.Task;
import com.focuszen.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserAndCompleted(User user, boolean completed);
}
