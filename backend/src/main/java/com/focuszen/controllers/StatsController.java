package com.focuszen.controllers;

import com.focuszen.dto.StatsResponseDTO;
import com.focuszen.services.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/weekly")
    public StatsResponseDTO getWeeklyStats(Authentication authentication) {
        String email = authentication.getName();
        return statsService.getWeeklyStats(email);
    }
}
