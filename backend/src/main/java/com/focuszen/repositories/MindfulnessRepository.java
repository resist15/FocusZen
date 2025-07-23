package com.focuszen.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.focuszen.entity.MindfulnessLog;
import com.focuszen.entity.User;

public interface MindfulnessRepository extends JpaRepository<MindfulnessLog, Long> {
    List<MindfulnessLog> findByUser(User user);
    @Query("SELECT COALESCE(SUM(m.durationInMinutes), 0) FROM MindfulnessLog m WHERE m.user = :user AND m.startTime BETWEEN :start AND :end")
    long sumDurationInMinutesByUserAndDateBetween(@Param("user") User user, @Param("start") int start, @Param("end") int end);
}
