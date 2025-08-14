package com.focuszen.services;

import java.time.LocalDate;
import java.util.List;

import com.focuszen.dto.RoutineDTO;
import com.focuszen.dto.RoutineEntryDTO;

public interface RoutineService {
    RoutineDTO createRoutine(RoutineDTO dto, String email);
    List<RoutineDTO> getUserRoutines(String email);
    void toggleRoutineEntry(Long routineId, String date);
    List<RoutineEntryDTO> getRoutineEntries(Long routineId);
    void deleteRoutine(Long routineId, String email);
    List<Long> getCompletedRoutineIds(String email, LocalDate date);
}
