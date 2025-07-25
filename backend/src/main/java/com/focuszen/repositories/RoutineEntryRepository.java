package com.focuszen.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.focuszen.entity.Routine;
import com.focuszen.entity.RoutineEntry;
import com.focuszen.entity.User;

public interface RoutineEntryRepository extends JpaRepository<RoutineEntry, Long> {
    List<RoutineEntry> findByRoutineAndDate(Routine routine, LocalDate date);
    List<RoutineEntry> findByRoutineId(Long routineId);
    long countByRoutineUserAndDateBetween(User user, LocalDate start, LocalDate end);
    List<RoutineEntry> findByRoutineInAndDate(List<Routine> routines, LocalDate date);
}
