package com.focuszen.controllers;

import com.focuszen.dto.TaskRequestDTO;
import com.focuszen.dto.TaskResponseDTO;
import com.focuszen.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> create(@RequestBody TaskRequestDTO dto, Authentication auth) {
        return ResponseEntity.ok(taskService.createTask(dto, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAll(Authentication auth) {
        return ResponseEntity.ok(taskService.getAllTasks(auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> update(
            @PathVariable Long id,
            @RequestBody TaskRequestDTO dto,
            Authentication auth
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, dto, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        taskService.deleteTask(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TaskResponseDTO>> filterByCompleted(
            @RequestParam boolean completed,
            Authentication auth
    ) {
        return ResponseEntity.ok(taskService.getTasksByCompletion(completed, auth.getName()));
    }

}
