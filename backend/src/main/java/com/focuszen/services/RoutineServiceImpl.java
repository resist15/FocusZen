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
            // Toggle off (delete existing entry)
            entryRepository.deleteAll(entries);
        } else {
            // Toggle on (create new entry)
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

    private RoutineDTO toDto(Routine r) {
        return RoutineDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .active(r.isActive())
                .build();
    }
}
