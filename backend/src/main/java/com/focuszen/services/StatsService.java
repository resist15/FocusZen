package com.focuszen.services;

import com.focuszen.dto.StatsResponseDTO;

public interface StatsService {
    StatsResponseDTO getWeeklyStats(String userEmail);
}
