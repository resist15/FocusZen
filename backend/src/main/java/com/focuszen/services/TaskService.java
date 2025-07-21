package com.focuszen.services;

import com.focuszen.dto.TaskRequestDTO;
import com.focuszen.dto.TaskResponseDTO;

import java.util.List;

public interface TaskService {
    TaskResponseDTO createTask(TaskRequestDTO dto, String userEmail);
    List<TaskResponseDTO> getAllTasks(String userEmail);
    TaskResponseDTO updateTask(Long taskId, TaskRequestDTO dto, String userEmail);
    void deleteTask(Long taskId, String userEmail);
    // for filtering by completion status
    List<TaskResponseDTO> getTasksByCompletion(boolean completed, String userEmail);
}
