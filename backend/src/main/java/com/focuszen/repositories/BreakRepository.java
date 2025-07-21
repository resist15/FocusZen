package com.focuszen.repositories;

import com.focuszen.entity.BreakLog;
import com.focuszen.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BreakRepository extends JpaRepository<BreakLog, Long> {
    List<BreakLog> findByUser(User user);
}
