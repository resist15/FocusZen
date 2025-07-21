package com.focuszen.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.focuszen.entity.BreakLog;
import com.focuszen.entity.User;

public interface BreakRepository extends JpaRepository<BreakLog, Long> {
    List<BreakLog> findByUser(User user);
    
    @Query("SELECT COALESCE(SUM(b.durationInMinutes), 0) FROM BreakLog b WHERE b.user = :user AND b.startTime BETWEEN :start AND :end")
    long sumDurationInMinutesByUserAndDateBetween(@Param("user") User user, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COALESCE(SUM(b.durationInMinutes), 0) FROM BreakLog b WHERE b.user.id = :userId AND b.timestamp > :since")
    int sumDurationByUserSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}
