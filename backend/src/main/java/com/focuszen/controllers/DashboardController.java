package com.focuszen.controllers;

import com.focuszen.dto.DashboardSummaryDTO;
import com.focuszen.entity.User;
import com.focuszen.services.DashboardService;
import com.focuszen.services.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryDTO getSummary(@AuthenticationPrincipal User user) {
        return dashboardService.getSummaryForToday(user);
    }
}
