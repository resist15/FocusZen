package com.focuszen.services;

import com.focuszen.dto.DashboardSummaryDTO;
import com.focuszen.entity.User;

public interface DashboardService {
    DashboardSummaryDTO getSummaryForToday(User user);
}
