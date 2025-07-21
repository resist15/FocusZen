package com.focuszen.services;

import com.focuszen.dto.RoutineDTO;
import com.focuszen.dto.RoutineEntryDTO;

import java.util.List;

public interface RoutineService {
    RoutineDTO createRoutine(RoutineDTO dto, String email);
    List<RoutineDTO> getUserRoutines(String email);
    void toggleRoutineEntry(Long routineId, String date);
    List<RoutineEntryDTO> getRoutineEntries(Long routineId);
}
