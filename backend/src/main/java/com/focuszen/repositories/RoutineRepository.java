package com.focuszen.repositories;

import com.focuszen.entity.Routine;
import com.focuszen.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByUser(User user);
    List<Routine> findByUserAndActiveTrue(User user);
}
