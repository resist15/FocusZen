package com.focuszen.services;

import com.focuszen.dto.RoutineDTO;
import com.focuszen.dto.RoutineEntryDTO;
import com.focuszen.entity.Routine;
import com.focuszen.entity.RoutineEntry;
import com.focuszen.entity.User;
import com.focuszen.repositories.RoutineEntryRepository;
import com.focuszen.repositories.RoutineRepository;
import com.focuszen.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoutineServiceImpl implements RoutineService {

    private final RoutineRepository routineRepository;
    private final RoutineEntryRepository entryRepository;
    private final UserRepository userRepository;

    @Override
    public RoutineDTO createRoutine(RoutineDTO dto, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Routine routine = Routine.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .active(true)
                .user(user)
                .build();
        Routine saved = routineRepository.save(routine);
        return toDto(saved);
    }

    @Override
    public List<RoutineDTO> getUserRoutines(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return routineRepository.findByUser(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void toggleRoutineEntry(Long routineId, String date) {
        Routine routine = routineRepository.findById(routineId).orElseThrow();
        LocalDate localDate = LocalDate.parse(date);

        List<RoutineEntry> entries = entryRepository.findByRoutineAndDate(routine, localDate);
        if (!entries.isEmpty()) {
            entryRepository.deleteAll(entries);
        } else {
            RoutineEntry entry = RoutineEntry.builder()
                    .routine(routine)
                    .date(localDate)
                    .build();
            entryRepository.save(entry);
        }
    }

    @Override
    public List<RoutineEntryDTO> getRoutineEntries(Long routineId) {
        return entryRepository.findByRoutineId(routineId).stream()
                .map(entry -> RoutineEntryDTO.builder()
                        .id(entry.getId())
                        .routineId(entry.getRoutine().getId())
                        .date(entry.getDate().toString())
                        .build())
                .collect(Collectors.toList());
    }
    @Override
    public void deleteRoutine(Long routineId, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Routine routine = routineRepository.findById(routineId)
            .orElseThrow(() -> new RuntimeException("Routine not found"));

        if (!routine.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this routine");
        }

        List<RoutineEntry> entries = entryRepository.findByRoutineId(routineId);
        entryRepository.deleteAll(entries);

        routineRepository.delete(routine);
    }

    @Override
    public List<Long> getCompletedRoutineIds(String email, LocalDate date) {
        User user = userRepository.findByEmail(email).orElseThrow();

        List<Routine> userRoutines = routineRepository.findByUser(user);

        return entryRepository.findByRoutineInAndDate(userRoutines, date)
                .stream()
                .map(entry -> entry.getRoutine().getId())
                .distinct()
                .collect(Collectors.toList());
    }

    private RoutineDTO toDto(Routine r) {
        return RoutineDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .active(r.isActive())
                .build();
    }
}
