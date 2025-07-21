package com.focuszen.controllers;

import com.focuszen.dto.RoutineDTO;
import com.focuszen.dto.RoutineEntryDTO;
import com.focuszen.services.RoutineService;
import com.focuszen.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
