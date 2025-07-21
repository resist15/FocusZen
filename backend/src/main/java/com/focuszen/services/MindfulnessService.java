package com.focuszen.services;

import com.focuszen.dto.MindfulnessDTO;

import java.util.List;

public interface MindfulnessService {
    MindfulnessDTO logActivity(MindfulnessDTO mindfulnessDTO, String username);
    List<MindfulnessDTO> getUserMindfulnessLogs(String username);
    void deleteMindfulnessLog(Long logId, String username);
}
