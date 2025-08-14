package com.focuszen.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.focuszen.dto.RoutineDTO;
import com.focuszen.dto.RoutineEntryDTO;
import com.focuszen.services.RoutineService;
import com.focuszen.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/routines")
@RequiredArgsConstructor
public class RoutineController {

    private final RoutineService routineService;
    private final JwtUtil jwtUtil;

    private String getUserEmail(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader != null ? authHeader.replace("Bearer ", "") : "";
        return jwtUtil.extractUsername(token);
    }

    @PostMapping
    public ResponseEntity<RoutineDTO> createRoutine(@RequestBody RoutineDTO dto, HttpServletRequest request) {
        String email = getUserEmail(request);
        return ResponseEntity.ok(routineService.createRoutine(dto, email));
    }

    @GetMapping
    public ResponseEntity<List<RoutineDTO>> getRoutines(HttpServletRequest request) {
        String email = getUserEmail(request);
        return ResponseEntity.ok(routineService.getUserRoutines(email));
    }

    @PostMapping("/{routineId}/toggle")
    public ResponseEntity<Void> toggleEntry(@PathVariable Long routineId, @RequestParam String date) {
        routineService.toggleRoutineEntry(routineId, date);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{routineId}/entries")
    public ResponseEntity<List<RoutineEntryDTO>> getEntries(@PathVariable Long routineId) {
        return ResponseEntity.ok(routineService.getRoutineEntries(routineId));
    }
    
    @DeleteMapping("/{routineId}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long routineId, HttpServletRequest request) {
        String email = getUserEmail(request);
        routineService.deleteRoutine(routineId, email);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/completed")
    public ResponseEntity<List<Long>> getCompletedRoutines(
            @RequestParam String date,
            Authentication auth
    ) {
        LocalDate localDate = LocalDate.parse(date);
        List<Long> completed = routineService.getCompletedRoutineIds(auth.getName(), localDate);
        return ResponseEntity.ok(completed);
    }

}
