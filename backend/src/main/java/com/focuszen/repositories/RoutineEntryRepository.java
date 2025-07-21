package com.focuszen.repositories;

import com.focuszen.entity.Routine;
import com.focuszen.entity.RoutineEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RoutineEntryRepository extends JpaRepository<RoutineEntry, Long> {
    List<RoutineEntry> findByRoutineAndDate(Routine routine, LocalDate date);
    List<RoutineEntry> findByRoutineId(Long routineId);
}
