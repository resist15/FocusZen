package com.focuszen.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.focuszen.dto.BreakDTO;
import com.focuszen.entity.BreakLog;
import com.focuszen.entity.User;
import com.focuszen.repositories.BreakRepository;
import com.focuszen.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BreakServiceImpl implements BreakService {

    private final BreakRepository breakRepository;
    private final UserRepository userRepository;

    @Override
    public BreakDTO logBreak(BreakDTO breakDTO, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        BreakLog breakLog = BreakLog.builder()
                .type(breakDTO.getType())
                .durationInMinutes(breakDTO.getDurationInMinutes())
                .timestamp(breakDTO.getTimestamp())
                .user(user)
                .build();

        BreakLog saved = breakRepository.save(breakLog);
        breakDTO.setId(saved.getId());
        return breakDTO;
    }

    @Override
    public List<BreakDTO> getUserBreaks(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return breakRepository.findByUser(user).stream().map(b -> BreakDTO.builder()
                .id(b.getId())
                .type(b.getType())
                .durationInMinutes(b.getDurationInMinutes())
                .timestamp(b.getTimestamp())
                .build()).collect(Collectors.toList());
    }

    @Override
    public void deleteBreak(Long breakId, String username) {
        BreakLog breakLog = breakRepository.findById(breakId).orElseThrow();
        if (!breakLog.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        breakRepository.delete(breakLog);
    }
}
