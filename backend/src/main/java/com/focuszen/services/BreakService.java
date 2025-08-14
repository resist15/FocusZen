package com.focuszen.services;

import com.focuszen.dto.BreakDTO;

import java.util.List;

public interface BreakService {
    BreakDTO logBreak(BreakDTO breakDTO, String username);
    List<BreakDTO> getUserBreaks(String username);
    void deleteBreak(Long breakId, String username);
}
