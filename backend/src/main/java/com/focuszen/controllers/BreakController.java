package com.focuszen.controllers;

import com.focuszen.dto.BreakDTO;
import com.focuszen.services.BreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/breaks")
@RequiredArgsConstructor
public class BreakController {

    private final BreakService breakService;

    @PostMapping
    public ResponseEntity<BreakDTO> logBreak(@RequestBody BreakDTO breakDTO, Authentication auth) {
        return ResponseEntity.ok(breakService.logBreak(breakDTO, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<BreakDTO>> getBreaks(Authentication auth) {
        return ResponseEntity.ok(breakService.getUserBreaks(auth.getName()));
    }

    @DeleteMapping("/{breakId}")
    public ResponseEntity<Void> deleteBreak(@PathVariable Long breakId, Authentication auth) {
        breakService.deleteBreak(breakId, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
