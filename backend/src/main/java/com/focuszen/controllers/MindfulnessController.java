package com.focuszen.controllers;

import com.focuszen.dto.MindfulnessDTO;
import com.focuszen.exceptions.ResourceNotFoundException;
import com.focuszen.services.MindfulnessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mindfulness")
@RequiredArgsConstructor
public class MindfulnessController {

    private final MindfulnessService mindfulnessService;

    @PostMapping
    public ResponseEntity<MindfulnessDTO> logActivity(@RequestBody MindfulnessDTO dto, Authentication auth) {
        return ResponseEntity.ok(mindfulnessService.logActivity(dto, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<MindfulnessDTO>> getLogs(Authentication auth) {
        return ResponseEntity.ok(mindfulnessService.getUserMindfulnessLogs(auth.getName()));
    }

    @DeleteMapping("/{logId}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long logId, Authentication auth) throws ResourceNotFoundException {
        mindfulnessService.deleteMindfulnessLog(logId, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
